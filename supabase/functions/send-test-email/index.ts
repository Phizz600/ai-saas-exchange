
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
    // Log available environment variables (without revealing their values)
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Environment check:", {
      hasResendKey: !!apiKey,
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      supabaseUrl: Deno.env.get("SUPABASE_URL"), // Safe to log URL
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 3) : "N/A",
      apiKeySuffix: apiKey ? apiKey.substring(apiKey.length - 3) : "N/A"
    });

    // Log request body for debugging
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    // Initialize Supabase admin client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Supabase client initialized");
    
    // First check for users in auth.users
    console.log("Attempting to fetch most recent user from auth.users...");
    const { data: authUsers, error: authUserError } = await supabase
      .from('auth')
      .select('users(id, email, created_at)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let userEmail;
    let firstName = "User";
    let userType = "ai_investor";

    if (authUserError || !authUsers) {
      console.log("Could not fetch from auth.users, trying profiles table");
      
      // Get the most recent user from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, user_type')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (profilesError || !profiles || profiles.length === 0) {
        console.error("Error fetching from profiles:", profilesError);
        throw new Error(`No users found in the system or unable to access user data`);
      }

      // Get the user email from auth.users using the profile ID
      const profile = profiles[0];
      const { data: userData, error: userError } = await supabase
        .auth.admin.getUserById(profile.id);
      
      if (userError || !userData || !userData.user || !userData.user.email) {
        console.error("Error fetching user email:", userError);
        throw new Error("Unable to retrieve user email");
      }
      
      userEmail = userData.user.email;
      firstName = profile.first_name || "User";
      userType = profile.user_type || "ai_investor";
    } else {
      // Use data from auth.users
      const user = authUsers.users;
      userEmail = user.email;
    }

    if (!userEmail) {
      throw new Error("Unable to find any users with email addresses");
    }

    console.log(`Sending test email to user: ${userEmail}`);

    // Check if Resend API key is available
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    // Initialize Resend with the API key
    const resend = new Resend(apiKey);
    
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
              padding: 30px;
              text-align: center;
              background: linear-gradient(135deg, #D946EE 0%, #8B5CF6 50%, #0EA4E9 100%);
            }
            .logo {
              width: 180px;
              height: auto;
              margin-bottom: 10px;
            }
            .email-body {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #8B5CF6;
            }
            h1 {
              color: #D946EE;
              font-weight: 700;
              margin-top: 0;
              margin-bottom: 24px;
              font-size: 28px;
              line-height: 1.3;
            }
            h2 {
              color: #0EA4E9;
              font-weight: 600;
              font-size: 22px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            p {
              margin-bottom: 16px;
              color: #4B5563;
            }
            .feature-list {
              background-color: #f0ecff;
              border-radius: 10px;
              padding: 25px;
              margin-bottom: 30px;
              border-left: 4px solid #8B5CF6;
            }
            .feature-list ul {
              margin: 10px 0 0;
              padding-left: 20px;
            }
            .feature-list li {
              margin-bottom: 12px;
              position: relative;
            }
            .feature-list li::before {
              content: "→";
              color: #D946EE;
              font-weight: bold;
              display: inline-block;
              width: 1em;
              margin-left: -1em;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(90deg, #D946EE 0%, #8B5CF6 100%);
              color: white;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 30px 0;
              transition: all 0.3s ease;
              text-align: center;
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 15px rgba(139, 92, 246, 0.3);
            }
            .divider {
              height: 1px;
              background-color: #E5E7EB;
              margin: 30px 0;
            }
            .support-section {
              background-color: #E0F2FE;
              border-radius: 10px;
              padding: 20px;
              margin-top: 20px;
            }
            .support-section h3 {
              color: #0EA4E9;
              margin-top: 0;
              font-size: 18px;
            }
            .email-footer {
              background-color: #F3F4F6;
              padding: 25px;
              text-align: center;
              color: #6B7280;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-link {
              display: inline-block;
              margin: 0 10px;
              font-weight: 500;
              color: #8B5CF6;
              text-decoration: none;
            }
            .highlight {
              color: #D946EE;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img src="https://aiexchange.club/ai-exchange-logo.png" alt="AI Exchange Club" class="logo">
            </div>
            
            <div class="email-body">
              <h1>Welcome to the AI Exchange Community!</h1>
              
              <p class="greeting">Hi ${firstName || "there"},</p>
              
              <p>We're excited to have you join our global community of AI enthusiasts, innovators, and investors. The AI Exchange Club is where groundbreaking AI solutions meet the resources they need to thrive.</p>
              
              ${userType === 'ai_builder' ? `
                <h2>Your AI Builder Journey Begins</h2>
                <div class="feature-list">
                  <p>Here's what you can do with your new account:</p>
                  <ul>
                    <li><strong>Showcase your AI innovations</strong> to a curated network of investors and partners</li>
                    <li><strong>Connect directly with investors</strong> interested in AI technologies like yours</li>
                    <li><strong>Gain visibility</strong> for your solutions through our marketplace</li>
                    <li><strong>Access resources</strong> to help scale your AI business faster</li>
                  </ul>
                </div>
              ` : `
                <h2>Your AI Investor Journey Begins</h2>
                <div class="feature-list">
                  <p>Here's what you can do with your new account:</p>
                  <ul>
                    <li><strong>Discover vetted AI solutions</strong> across various domains and industries</li>
                    <li><strong>Connect directly with builders</strong> creating the future of AI technology</li>
                    <li><strong>Track potential opportunities</strong> based on your investment criteria</li>
                    <li><strong>Get early access</strong> to promising AI products before they hit the mainstream</li>
                  </ul>
                </div>
              `}
              
              <p>Our platform is designed to make connections that matter and facilitate growth in the rapidly evolving AI landscape. We've created a secure environment where AI builders and investors can collaborate with confidence.</p>
              
              <center>
                <a href="https://aiexchange.club/marketplace" class="cta-button">Explore the AI Marketplace</a>
              </center>
              
              <div class="divider"></div>
              
              <p>To get the most out of your membership, we recommend completing your profile and exploring the marketplace to see what's trending in AI today.</p>
              
              <div class="support-section">
                <h3>Need Assistance?</h3>
                <p>If you have any questions or need help navigating the platform, our team is here to support you. Simply reply to this email or visit our help center.</p>
              </div>
              
              <p>Looking forward to seeing your impact in the AI ecosystem!</p>
              
              <p>Best regards,<br><span class="highlight">The AI Exchange Club Team</span></p>
            </div>
            
            <div class="email-footer">
              <div class="social-links">
                <a href="https://twitter.com/aiexchangeclub" class="social-link">Twitter</a>
                <a href="https://linkedin.com/company/aiexchangeclub" class="social-link">LinkedIn</a>
                <a href="https://aiexchange.club/blog" class="social-link">Blog</a>
              </div>
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
