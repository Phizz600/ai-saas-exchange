
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  firstName: string;
  email: string;
  userType: 'ai_builder' | 'ai_investor';
  timestamp?: string;
  source?: string;
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
      return new Response(
        JSON.stringify({
          error: "Missing RESEND_API_KEY",
          details: "The Resend API key is not configured in Supabase secrets"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    console.log(`Using API key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);

    // Validate API key format
    if (!apiKey.startsWith("re_")) {
      console.error("Invalid Resend API key format. Expected to start with 're_'");
      return new Response(
        JSON.stringify({
          error: "Invalid Resend API key format",
          details: "The Resend API key should start with 're_'. Please check the key in your Supabase secrets."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData = await req.json();
    console.log("Request data received:", JSON.stringify(requestData, null, 2));

    // Extract and validate email data
    const { firstName, email, userType, timestamp, source }: WelcomeEmailRequest = requestData;
    
    if (!email) {
      console.error("Missing email in request");
      return new Response(
        JSON.stringify({
          error: "Email is required",
          details: "The email field is missing from the request"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    if (!firstName) {
      console.log("First name not provided, using default");
    }
    
    if (!userType) {
      console.log("User type not provided, using default");
    }

    console.log(`Sending welcome email to ${email} (${userType || "unknown type"})`);
    console.log(`Request metadata - timestamp: ${timestamp || "none"}, source: ${source || "none"}`);

    // Initialize Resend with the API key - this can help ensure the API key is properly loaded
    const resend = new Resend(apiKey);
    
    // Try sending the email with proper error handling
    try {
      // Send the welcome email using a verified sender address
      const emailResponse = await resend.emails.send({
        from: "AI Exchange Club <khalid@aiexchange.club>",
        to: [email],
        subject: `Welcome to AI Exchange Club, ${firstName || "New User"}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Welcome to AI Exchange Club</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&display=swap');
              
              body {
                font-family: 'Exo 2', Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
              }
              .email-header {
                padding: 24px;
                text-align: center;
                background: linear-gradient(90deg, #D946EE 0%, #8B5CF6 50%, #0EA4E9 100%);
              }
              .email-header img {
                max-width: 200px;
                height: auto;
              }
              .email-body {
                padding: 30px;
              }
              .greeting {
                font-size: 18px;
                margin-bottom: 20px;
              }
              h1 {
                color: #8B5CF6;
                font-weight: 700;
                margin-top: 0;
                margin-bottom: 24px;
                font-size: 28px;
              }
              h2 {
                color: #0EA4E9;
                font-weight: 600;
                font-size: 22px;
                margin-top: 30px;
                margin-bottom: 15px;
              }
              .feature-list {
                background-color: #f6f5ff;
                border-radius: 8px;
                padding: 20px 25px;
                margin-bottom: 25px;
              }
              .feature-list ul {
                margin: 0;
                padding-left: 20px;
              }
              .feature-list li {
                margin-bottom: 10px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(90deg, #D946EE 0%, #8B5CF6 100%);
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                margin: 25px 0;
                transition: all 0.3s ease;
              }
              .cta-button:hover {
                opacity: 0.9;
                transform: translateY(-2px);
              }
              .email-footer {
                background-color: #f6f5ff;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
              }
              .social-icons {
                margin: 15px 0;
              }
              .social-icon {
                display: inline-block;
                margin: 0 10px;
                width: 24px;
                height: 24px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <img src="https://aiexchange.club/ai-exchange-logo.png" alt="AI Exchange Club Logo">
              </div>
              
              <div class="email-body">
                <h1>Welcome to the AI Exchange Club!</h1>
                
                <p class="greeting">Hi ${firstName || "there"},</p>
                
                <p>We're thrilled to welcome you to our community of passionate individuals in the AI ecosystem! You've joined at an exciting time as AI continues to transform industries worldwide.</p>
                
                ${userType === 'ai_builder' ? `
                  <h2>Your Journey as an AI Builder Starts Now</h2>
                  <div class="feature-list">
                    <p>Here's what you can do with your new account:</p>
                    <ul>
                      <li><strong>Showcase your AI solutions</strong> to potential investors and partners</li>
                      <li><strong>Connect with investors</strong> looking for the next big AI innovation</li>
                      <li><strong>Track engagement</strong> with your products and analyze market interest</li>
                      <li><strong>Access resources</strong> to help scale your AI business</li>
                    </ul>
                  </div>
                ` : `
                  <h2>Your Journey as an AI Investor Starts Now</h2>
                  <div class="feature-list">
                    <p>Here's what you can do with your new account:</p>
                    <ul>
                      <li><strong>Discover innovative AI solutions</strong> across various domains and industries</li>
                      <li><strong>Connect directly with builders</strong> creating cutting-edge AI technology</li>
                      <li><strong>Track potential investment opportunities</strong> based on your preferences</li>
                      <li><strong>Get early access</strong> to promising AI products and services</li>
                    </ul>
                  </div>
                `}
                
                <p>Our platform is designed to create meaningful connections and facilitate growth in the AI space. Whether you're building, investing, or exploring, we're here to support your journey.</p>
                
                <center>
                  <a href="https://aiexchange.club/marketplace" class="cta-button">Explore the Marketplace</a>
                </center>
                
                <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
                
                <p>Best regards,<br>The AI Exchange Club Team</p>
              </div>
              
              <div class="email-footer">
                <p>© 2023 AI Exchange Club. All rights reserved.</p>
                <p>This email was sent to ${email}</p>
              </div>
            </div>
          </body>
          </html>
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
    } catch (emailError: any) {
      console.error("Error sending email with Resend:", emailError);
      
      let errorDetail = "Unknown error";
      let errorSuggestion = "";
      
      if (emailError.name === "validation_error") {
        errorDetail = "The Resend API key is invalid or has been revoked";
        errorSuggestion = "Please generate a new API key in your Resend dashboard";
      } else if (emailError.message?.includes("fetch")) {
        errorDetail = "Network error connecting to Resend API";
        errorSuggestion = "Check your server's internet connection";
      } else if (emailError.message?.includes("domain")) {
        errorDetail = "Domain verification issue";
        errorSuggestion = "You need to verify your domain in Resend before sending emails";
      }
      
      return new Response(
        JSON.stringify({ 
          error: emailError.message || "Failed to send email",
          details: errorDetail,
          suggestion: errorSuggestion,
          stack: emailError.stack,
          name: emailError.name
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    console.error("Error details:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        stack: error.stack,
        context: "Error occurred in send-welcome-email Edge Function"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
