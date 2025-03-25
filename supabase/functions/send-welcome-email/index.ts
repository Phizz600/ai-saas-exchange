
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
    
    // Set the destination URL based on userType
    const ctaButtonUrl = userType === 'ai_builder' 
      ? 'https://aiexchange.club/list-product' 
      : 'https://aiexchange.club/coming-soon';
    
    const ctaButtonText = userType === 'ai_builder'
      ? 'List Your AI Product'
      : 'Explore the Marketplace';
    
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
              @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Exo 2', Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              
              .email-wrapper {
                max-width: 100%;
                margin: 0 auto;
                background-color: #f9f9f9;
                padding: 20px;
              }
              
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
              }
              
              .email-header {
                padding: 30px 20px;
                text-align: center;
                background: linear-gradient(135deg, #D946EE 0%, #8B5CF6 50%, #0EA4E9 100%);
                position: relative;
              }
              
              .logo {
                max-width: 180px;
                height: auto;
                display: inline-block;
                margin-bottom: 15px;
              }
              
              .header-title {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.15);
                letter-spacing: 0.5px;
              }
              
              .header-subtitle {
                color: rgba(255,255,255,0.9);
                font-size: 18px;
                font-weight: 400;
                margin-top: 5px;
              }
              
              .email-body {
                padding: 40px 30px;
              }
              
              .greeting {
                font-size: 20px;
                margin-bottom: 25px;
                color: #333;
                font-weight: 500;
              }
              
              .greeting strong {
                color: #8B5CF6;
                font-weight: 700;
              }
              
              h1 {
                color: #8B5CF6;
                font-weight: 700;
                margin-top: 0;
                margin-bottom: 30px;
                font-size: 26px;
                letter-spacing: -0.5px;
              }
              
              h2 {
                color: #0EA4E9;
                font-weight: 600;
                font-size: 22px;
                margin-top: 40px;
                margin-bottom: 18px;
              }
              
              p {
                margin: 0 0 20px;
                color: #333;
                font-size: 16px;
              }
              
              .feature-list {
                background-color: #f7f5ff;
                border-radius: 12px;
                padding: 25px 30px;
                margin-bottom: 30px;
                border-left: 5px solid #8B5CF6;
              }
              
              .feature-list ul {
                margin: 15px 0 5px;
                padding-left: 25px;
              }
              
              .feature-list li {
                margin-bottom: 12px;
                position: relative;
                list-style-type: none;
                padding-left: 5px;
              }
              
              .feature-list li:before {
                content: "•";
                color: #D946EE;
                font-weight: bold;
                font-size: 24px;
                display: inline-block;
                width: 20px;
                position: absolute;
                left: -20px;
                top: -5px;
              }
              
              .feature-list li strong {
                color: #0EA4E9;
                font-weight: 600;
              }
              
              .cta-container {
                text-align: center;
                margin: 35px 0;
              }
              
              .cta-button {
                display: inline-block;
                background: linear-gradient(90deg, #D946EE 0%, #8B5CF6 100%);
                color: white;
                text-decoration: none;
                padding: 16px 30px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 18px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
              }
              
              .email-footer {
                background-color: #f6f5ff;
                padding: 25px 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #eee;
              }
              
              .footer-social {
                margin: 15px 0 20px;
              }
              
              .footer-text {
                margin-bottom: 8px;
                color: #777;
                font-size: 14px;
              }
              
              .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, rgba(139, 92, 246, 0.4), transparent);
                margin: 30px 0;
              }
              
              .highlight {
                color: #D946EE;
                font-weight: 600;
              }
              
              @media only screen and (max-width: 550px) {
                .email-body {
                  padding: 30px 20px;
                }
                
                h1 {
                  font-size: 24px;
                }
                
                h2 {
                  font-size: 20px;
                }
                
                .feature-list {
                  padding: 20px 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <img src="https://aiexchange.club/ai-exchange-logo.png" alt="AI Exchange Club Logo" class="logo">
                  <h1 class="header-title">Welcome to the Future of AI</h1>
                  <p class="header-subtitle">Where Innovation Meets Investment</p>
                </div>
                
                <div class="email-body">
                  <p class="greeting">Hi <strong>${firstName || "there"}</strong>,</p>
                  
                  <p>We're thrilled to welcome you to the <span class="highlight">AI Exchange Club</span> — your gateway to the future of artificial intelligence. You've joined at an exciting time as AI continues to transform industries worldwide.</p>
                  
                  ${userType === 'ai_builder' ? `
                    <h2>Your Journey as an AI Builder Starts Now</h2>
                    <div class="feature-list">
                      <p>Here's what you can do with your new account:</p>
                      <ul>
                        <li><strong>Showcase your AI solutions</strong> to a curated network of potential investors and partners</li>
                        <li><strong>Connect with investors</strong> who are actively looking for the next big AI innovation</li>
                        <li><strong>Track engagement metrics</strong> with your products and analyze market interest in real-time</li>
                        <li><strong>Access exclusive resources</strong> and support to help scale your AI business</li>
                      </ul>
                    </div>
                  ` : `
                    <h2>Your Journey as an AI Investor Starts Now</h2>
                    <div class="feature-list">
                      <p>Here's what you can do with your new account:</p>
                      <ul>
                        <li><strong>Discover innovative AI solutions</strong> across various domains and industries before they hit the mainstream market</li>
                        <li><strong>Connect directly with builders</strong> creating cutting-edge AI technology to form valuable partnerships</li>
                        <li><strong>Track potential investment opportunities</strong> based on your preferences and investment criteria</li>
                        <li><strong>Get early access</strong> to promising AI products and services with exclusive member benefits</li>
                      </ul>
                    </div>
                  `}
                  
                  <p>Our platform is designed to create meaningful connections and facilitate growth in the AI space. Whether you're building, investing, or exploring, we're here to support your journey every step of the way.</p>
                  
                  <div class="divider"></div>
                  
                  <p>To get started, we recommend exploring our marketplace to see what's currently trending in the AI space:</p>
                  
                  <div class="cta-container">
                    <a href="${ctaButtonUrl}" class="cta-button">${ctaButtonText}</a>
                  </div>
                  
                  <p>If you have any questions or need assistance, our team is ready to help you make the most of your AI Exchange Club membership. Just reply to this email or reach out to our support team.</p>
                  
                  <p>We're excited to see what you'll accomplish!</p>
                  
                  <p>Best regards,<br><span class="highlight">The AI Exchange Club Team</span></p>
                </div>
                
                <div class="email-footer">
                  <p class="footer-text">© 2023 AI Exchange Club. All rights reserved.</p>
                  <p class="footer-text">This email was sent to ${email}</p>
                  <p class="footer-text">You received this email because you signed up for an AI Exchange Club account.</p>
                </div>
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
