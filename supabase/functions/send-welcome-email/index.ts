
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize with null to detect if not properly set
let resend: Resend | null = null;

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

// Function to initialize Resend with retry logic
const initializeResend = (apiKey: string | undefined, retryCount = 0): Resend | null => {
  try {
    console.log(`Initializing Resend (attempt ${retryCount + 1})...`);
    
    if (!apiKey) {
      console.error("RESEND_API_KEY is undefined or empty");
      return null;
    }
    
    console.log(`Using API key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
    return new Resend(apiKey);
  } catch (error) {
    console.error(`Error initializing Resend (attempt ${retryCount + 1}):`, error);
    return null;
  }
};

// Function to send email with retry logic
const sendEmailWithRetry = async (
  resendClient: Resend,
  data: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  },
  maxRetries = 3
): Promise<any> => {
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Sending email attempt ${attempt + 1}/${maxRetries}...`);
      const response = await resendClient.emails.send(data);
      console.log(`Email sent successfully on attempt ${attempt + 1}:`, response);
      return response;
    } catch (error) {
      lastError = error;
      console.error(`Email sending failed on attempt ${attempt + 1}:`, error);
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff (wait longer between each retry)
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, etc.
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // If we reach here, all attempts failed
  throw lastError;
};

const handler = async (req: Request): Promise<Response> => {
  // Log the API endpoint being called and method
  console.log(`Handling ${req.method} request to send-welcome-email function`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting welcome email process");
    
    // Check if Resend API key is available and log it for debugging (redacted)
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
    // Only initialize once or if it failed previously
    if (!resend) {
      resend = initializeResend(apiKey);
      if (!resend) {
        throw new Error("Failed to initialize Resend client");
      }
    }

    // Parse and validate request data
    let requestData: WelcomeEmailRequest;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      throw new Error("Invalid JSON in request body");
    }

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

    console.log(`Preparing to send welcome email to ${email} (${userType || "unknown type"})`);
    
    // Try sending the email - using verified sender domain
    const emailResponse = await sendEmailWithRetry(resend, {
      from: "AI Exchange Club <hello@aiexchange.club>", // Using verified domain
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
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    console.error("Error details:", error.message, error.stack);
    
    // Check for specific error types
    const errorMessage = error.message || "Unknown error";
    let detailedError = "No additional details";
    let status = 500;
    
    if (error.name === "validation_error") {
      detailedError = "Resend API validation error: This usually means the API key is invalid or expired";
    } else if (errorMessage.includes("fetch")) {
      detailedError = "Network error reaching Resend API: Check your internet connection";
    } else if (errorMessage.includes("domain") || errorMessage.includes("sender")) {
      status = 400;
      detailedError = "Email domain not verified: Make sure your sender domain is verified in Resend";
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: detailedError,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
