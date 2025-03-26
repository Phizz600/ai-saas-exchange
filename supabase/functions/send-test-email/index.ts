
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get and validate API key
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

    console.log("Environment check:", {
      hasResendKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 3) : "N/A",
      apiKeySuffix: apiKey ? apiKey.substring(apiKey.length - 3) : "N/A",
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      supabaseUrl: Deno.env.get("SUPABASE_URL"),
    });

    // Log request body for debugging
    try {
      const requestBody = await req.json();
      console.log("Request body:", requestBody);
    } catch (e) {
      console.log("No request body or invalid JSON");
    }

    // Initialize Supabase admin client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Supabase client initialized");

    // First check for users in Supabase
    let userEmail = null;
    let firstName = "User";
    let userType = "ai_investor";
    
    console.log("Attempting to fetch users from Supabase...");
    
    try {
      // Get the most recent user from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, user_type')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (profilesError) {
        console.error("Error fetching from profiles:", profilesError);
        // Continue execution, we'll use default values
      }
      
      if (profiles && profiles.length > 0) {
        // Get the user email from auth.users using the profile ID
        const profile = profiles[0];
        firstName = profile.first_name || "User";
        userType = profile.user_type || "ai_investor";
        
        const { data: userData, error: userError } = await supabase
          .auth.admin.getUserById(profile.id);
        
        if (userError) {
          console.error("Error fetching user email:", userError);
        } else if (userData?.user?.email) {
          userEmail = userData.user.email;
        }
      }
    } catch (supabaseError) {
      console.error("Error during Supabase operations:", supabaseError);
      // Continue execution, we'll use fallback values
    }

    // Use test email if no users found
    if (!userEmail) {
      console.log("No users found, using test email");
      userEmail = "test@example.com";
    }

    console.log(`Sending test email to user: ${userEmail}`);

    // Initialize Resend with the API key and verify key format
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

    const resend = new Resend(apiKey);
    
    // Set the destination URL based on userType
    const ctaButtonUrl = userType === 'ai_builder' 
      ? 'https://aiexchange.club/list-product' 
      : 'https://aiexchange.club/investor-questionnaire';
    
    // Test the API key with a validation check
    try {
      console.log("Validating Resend API key...");
      // Send the welcome email with your verified domain
      const emailResponse = await resend.emails.send({
        from: "AI Exchange Club <khalid@aiexchange.club>",
        to: [userEmail],
        subject: `Welcome to AI Exchange Club, ${firstName}!`,
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
              .email-header h1 {
                color: white;
                margin-top: 15px;
                font-size: 24px;
              }
              .email-header p {
                color: white;
                margin: 5px 0 0;
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
                <img src="https://aiexchange.club/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" alt="AI Exchange Club Logo">
                <h1>Welcome to the AI Exchange Club!</h1>
                <p>Where Innovation Meets Investment</p>
              </div>
              
              <div class="email-body">
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
                  
                  <p>Ready to list your AI product and start attracting investors?</p>
                  
                  <center>
                    <a href="https://aiexchange.club/list-product" class="cta-button">List Your AI Product</a>
                  </center>
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
                  
                  <p>Let's start by understanding your investment preferences:</p>
                  
                  <center>
                    <a href="https://aiexchange.club/investor-questionnaire" class="cta-button">Start Investor Questionnaire</a>
                  </center>
                `}
                
                <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
                
                <p>Best regards,<br>The AI Exchange Club Team</p>
              </div>
              
              <div class="email-footer">
                <p>© 2023 AI Exchange Club. All rights reserved.</p>
                <p>This email was sent to ${userEmail}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Test email sent successfully:", emailResponse);

      return new Response(JSON.stringify({
        message: "Test email sent successfully",
        to: userEmail,
        firstName,
        userType,
        response: emailResponse
      }), {
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
    console.error("Error in send-test-email function:", error);
    console.error("Error details:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        context: "Error occurred in send-test-email Edge Function"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
