
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  firstName: string;
  email: string;
  userType: 'ai_builder' | 'ai_investor';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send welcome email");
    
    // Check if Resend API key is available and log it for debugging (redacted)
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    console.log(`Using API key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);

    const requestData = await req.json();
    console.log("Request data received:", JSON.stringify(requestData, null, 2));

    // Extract and validate email data
    const { firstName, email, userType }: WelcomeEmailRequest = requestData;
    
    if (!email) {
      console.error("Missing email in request");
      throw new Error("Email is required");
    }
    
    if (!firstName) {
      console.log("First name not provided, using default");
    }
    
    if (!userType) {
      console.log("User type not provided, using default");
    }

    console.log(`Sending welcome email to ${email} (${userType || "unknown type"})`);

    // Initialize Resend with the API key - this can help ensure the API key is properly loaded
    const resendClient = new Resend(apiKey);
    
    // Try sending the email - using the verified domain in the from address
    const emailResponse = await resendClient.emails.send({
      from: "AI Exchange Club <noreply@aiexchange.club>",
      to: [email],
      subject: `Welcome to AI Exchange Club, ${firstName || "New User"}!`,
      html: `
        <div style="font-family: 'Exo 2', sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6; font-family: 'Exo 2', sans-serif; font-weight: 700;">Welcome to AI Exchange Club!</h1>
          <p>Hi ${firstName || "there"},</p>
          <p>We're excited to have you join our community${userType === 'ai_builder' ? ' of AI builders' : ' of AI investors'}!</p>
          
          ${userType === 'ai_builder' ? `
            <h2 style="color: #0EA4E9; font-family: 'Exo 2', sans-serif; font-weight: 600;">Getting Started as an AI Builder</h2>
            <p>Here's what you can do now:</p>
            <ul>
              <li>List your AI business or product</li>
              <li>Connect with potential investors</li>
              <li>Track your product's performance</li>
            </ul>
          ` : `
            <h2 style="color: #0EA4E9; font-family: 'Exo 2', sans-serif; font-weight: 600;">Getting Started as an AI Investor</h2>
            <p>Here's what you can do now:</p>
            <ul>
              <li>Browse AI businesses and products</li>
              <li>Connect with AI builders</li>
              <li>Track your investment opportunities</li>
            </ul>
          `}
          
          <p>Visit our <a href="https://aiexchange.club" style="color: #D946EE;">marketplace</a> to get started!</p>
          
          <p>Best regards,<br>The AI Exchange Club Team</p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    console.error("Error details:", error.message, error.stack);
    
    // Check for specific error types
    const errorMessage = error.message || "Unknown error";
    let detailedError = "No additional details";
    
    if (error.name === "validation_error") {
      detailedError = "Resend API validation error: This usually means the API key is invalid or expired";
    } else if (errorMessage.includes("fetch")) {
      detailedError = "Network error reaching Resend API: Check your internet connection";
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: detailedError,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
