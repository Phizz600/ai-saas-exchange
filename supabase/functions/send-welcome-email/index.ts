import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  userType: 'ai_builder' | 'ai_investor';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, userType }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to ${email} (${userType})`);
    
    // Common styling
    const headerStyle = "font-size: 28px; font-weight: 700; color: #8B5CF6; margin-bottom: 24px; font-family: 'Exo 2', Arial, sans-serif; text-align: center;";
    const paragraphStyle = "font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px; font-family: Arial, sans-serif;";
    const buttonStyle = "display: inline-block; background: linear-gradient(90deg, #D946EE 0%, #8B5CF6 50%, #0EA4E9 100%); color: white; font-weight: bold; padding: 16px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-family: Arial, sans-serif; font-size: 16px;";
    const sectionStyle = "background: linear-gradient(135deg, #f6f5ff 0%, #f0f4ff 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #8B5CF6;";
    const featureStyle = "background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 12px 0;";
    
    let subject = "";
    let htmlContent = "";
    
    if (userType === 'ai_builder') {
      subject = `Welcome to AI Exchange Club, ${firstName}! 🚀 Ready to showcase your AI innovation?`;
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://pxadbwlidclnfoodjtpd.supabase.co/storage/v1/object/public/product-images/ai-exchange-logo.png" alt="AI Exchange Club Logo" style="width: 120px; margin-bottom: 20px;">
            <h1 style="${headerStyle}">Welcome to AI Exchange Club!</h1>
            <p style="font-size: 18px; color: #6B7280; margin: 0;">Where Innovation Meets Investment</p>
          </div>
          
          <p style="${paragraphStyle}">Hi ${firstName},</p>
          
          <p style="${paragraphStyle}">🎉 <strong>Congratulations!</strong> You've just joined the most exclusive community of AI builders and innovators. We're thrilled to have you on board!</p>
          
          <div style="${sectionStyle}">
            <h2 style="color: #8B5CF6; font-weight: 600; font-size: 20px; margin-bottom: 16px; font-family: 'Exo 2', Arial, sans-serif;">🚀 Your AI Builder Journey Starts Now</h2>
            <p style="${paragraphStyle}">As an AI Builder, you have access to powerful tools to showcase your innovations:</p>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">📈 Showcase Your AI Solutions</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Create compelling listings that highlight your AI products' unique value propositions</span>
            </div>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">💰 Connect with Investors</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Reach serious investors actively looking for the next big AI breakthrough</span>
            </div>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">📊 Track Performance</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Monitor engagement, analyze interest patterns, and optimize your listings</span>
            </div>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">🔧 Scale Your Business</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Access resources, networking opportunities, and expert guidance</span>
            </div>
          </div>
          
          <p style="${paragraphStyle}">Ready to list your first AI product and start attracting investors?</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://aiexchange.club/list-product" style="${buttonStyle}">🚀 List Your AI Product</a>
          </div>
          
          <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #92400E; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Products with detailed descriptions, clear use cases, and verified metrics get 3x more investor interest!
            </p>
          </div>
          
          <p style="${paragraphStyle}">If you have any questions or need assistance, our support team is here to help you succeed.</p>
          
          <p style="${paragraphStyle}">Welcome to the future of AI innovation! 🚀</p>
          
          <p style="${paragraphStyle}">Best regards,<br><strong>The AI Exchange Club Team</strong></p>
          
          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 32px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              © 2024 AI Exchange Club. All rights reserved.<br>
              You're receiving this email because you signed up for AI Exchange Club.
            </p>
          </div>
        </div>
      `;
    } else {
      // ai_investor
      subject = `Welcome to AI Exchange Club, ${firstName}! 💎 Discover your next AI investment`;
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://pxadbwlidclnfoodjtpd.supabase.co/storage/v1/object/public/product-images/ai-exchange-logo.png" alt="AI Exchange Club Logo" style="width: 120px; margin-bottom: 20px;">
            <h1 style="${headerStyle}">Welcome to AI Exchange Club!</h1>
            <p style="font-size: 18px; color: #6B7280; margin: 0;">Where Innovation Meets Investment</p>
          </div>
          
          <p style="${paragraphStyle}">Hi ${firstName},</p>
          
          <p style="${paragraphStyle}">🎉 <strong>Welcome!</strong> You've just gained exclusive access to the most curated marketplace of AI innovations. Get ready to discover your next big investment opportunity!</p>
          
          <div style="${sectionStyle}">
            <h2 style="color: #8B5CF6; font-weight: 600; font-size: 20px; margin-bottom: 16px; font-family: 'Exo 2', Arial, sans-serif;">💎 Your AI Investment Journey Begins</h2>
            <p style="${paragraphStyle}">As an AI Investor, you have privileged access to:</p>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">🔍 Curated AI Innovations</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Discover pre-vetted AI solutions across various industries and applications</span>
            </div>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">📊 Detailed Analytics</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Access comprehensive metrics, performance data, and growth projections</span>
            </div>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">🤝 Direct Builder Access</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Connect directly with AI builders and founders through our secure platform</span>
            </div>
            
            <div style="${featureStyle}">
              <strong style="color: #8B5CF6;">⚡ Early Access</strong><br>
              <span style="color: #6B7280; font-size: 14px;">Get first look at promising AI products before they hit the broader market</span>
            </div>
          </div>
          
          <p style="${paragraphStyle}">We're currently preparing an exclusive investor experience tailored just for you. Get ready to explore cutting-edge AI innovations!</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://aiexchange.club/coming-soon" style="${buttonStyle}">🔮 Set Investment Preferences</a>
          </div>
          
          <div style="background-color: #DBEAFE; border: 1px solid #3B82F6; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #1E40AF; font-size: 14px;">
              <strong>📈 Investment Insight:</strong> The AI market is projected to reach $1.3 trillion by 2032. Position yourself at the forefront of this revolution!
            </p>
          </div>
          
          <p style="${paragraphStyle}">Stay tuned for exclusive market insights, investment opportunities, and direct access to the most promising AI innovations.</p>
          
          <p style="${paragraphStyle}">Welcome to the future of AI investing! 💎</p>
          
          <p style="${paragraphStyle}">Best regards,<br><strong>The AI Exchange Club Team</strong></p>
          
          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 32px; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              © 2024 AI Exchange Club. All rights reserved.<br>
              You're receiving this email because you signed up for AI Exchange Club.
            </p>
          </div>
        </div>
      `;
    }
    
    const emailResponse = await resend.emails.send({
      from: "AI Exchange Club <team@aiexchange.club>",
      to: [email],
      subject: subject,
      html: htmlContent,
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