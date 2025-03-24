
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
    const { firstName, email, userType }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} (${userType})`);

    const emailResponse = await resend.emails.send({
      from: "AI Exchange Club <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to AI Exchange Club, ${firstName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Welcome to AI Exchange Club!</h1>
          <p>Hi ${firstName},</p>
          <p>We're excited to have you join our community${userType === 'ai_builder' ? ' of AI builders' : ' of AI investors'}!</p>
          
          ${userType === 'ai_builder' ? `
            <h2 style="color: #0EA4E9;">Getting Started as an AI Builder</h2>
            <p>Here's what you can do now:</p>
            <ul>
              <li>List your AI business or product</li>
              <li>Connect with potential investors</li>
              <li>Track your product's performance</li>
            </ul>
          ` : `
            <h2 style="color: #0EA4E9;">Getting Started as an AI Investor</h2>
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
