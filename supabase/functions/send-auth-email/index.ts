import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'signup' | 'reset' | 'welcome';
  confirmationUrl?: string;
  resetUrl?: string;
  firstName?: string;
  userType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, confirmationUrl, resetUrl, firstName, userType }: AuthEmailRequest = await req.json();

    console.log(`Sending ${type} email to:`, email);

    let subject: string;
    let html: string;

    switch (type) {
      case 'signup':
        subject = "Welcome to AI Exchange Club - Confirm Your Email";
        html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #D946EE; font-size: 32px; margin: 0;">AI Exchange Club</h1>
              <p style="color: #666; font-size: 16px; margin-top: 10px;">The Premier AI Business Marketplace</p>
            </div>
            
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Confirm Your Email Address</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Welcome to AI Exchange Club! Please confirm your email address to complete your registration and start exploring AI business opportunities.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background: linear-gradient(135deg, #D946EE, #8B5CF6); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                Confirm Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #D946EE; word-break: break-all;">${confirmationUrl}</a>
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #999; font-size: 14px;">
              <p>This email was sent from AI Exchange Club. If you didn't create an account, you can safely ignore this email.</p>
            </div>
          </div>
        `;
        break;

      case 'reset':
        subject = "Reset Your AI Exchange Club Password";
        html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #D946EE; font-size: 32px; margin: 0;">AI Exchange Club</h1>
              <p style="color: #666; font-size: 16px; margin-top: 10px;">The Premier AI Business Marketplace</p>
            </div>
            
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              We received a request to reset your password for your AI Exchange Club account. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #D946EE, #8B5CF6); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #D946EE; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              This link will expire in 1 hour for security reasons. If you didn't request a password reset, you can safely ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #999; font-size: 14px;">
              <p>This email was sent from AI Exchange Club. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        `;
        break;

      case 'welcome':
        subject = "Welcome to AI Exchange Club!";
        html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #D946EE; font-size: 32px; margin: 0;">AI Exchange Club</h1>
              <p style="color: #666; font-size: 16px; margin-top: 10px;">The Premier AI Business Marketplace</p>
            </div>
            
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome${firstName ? `, ${firstName}` : ''}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Thank you for joining AI Exchange Club, the premier marketplace for AI-powered businesses and investments.
            </p>
            
            <div style="background: linear-gradient(135deg, #D946EE, #8B5CF6); border-radius: 12px; padding: 25px; margin: 25px 0; color: white;">
              <h3 style="margin: 0 0 15px 0; font-size: 20px;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
                ${userType === 'ai_builder' ? `
                  <li>List your AI business for sale</li>
                  <li>Connect with qualified investors</li>
                  <li>Access our business valuation tools</li>
                ` : `
                  <li>Browse AI businesses for investment</li>
                  <li>Connect with AI entrepreneurs</li>
                  <li>Access investment analytics</li>
                `}
                <li>Join our community of AI innovators</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://aiexchange.club" style="background: white; color: #D946EE; border: 2px solid #D946EE; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                Start Exploring
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Welcome to the future of AI business. We're excited to have you aboard!</p>
              <p>Best regards,<br>The AI Exchange Club Team</p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: "AI Exchange Club <noreply@aiexchange.club>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
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