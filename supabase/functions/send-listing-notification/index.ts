
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ListingEmailRequest {
  type: 'submitted' | 'approved' | 'rejected';
  userEmail: string;
  productTitle: string;
  firstName?: string;
  feedback?: string;
  productId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userEmail, productTitle, firstName = "there", feedback = "", productId = "" }: ListingEmailRequest = await req.json();
    
    console.log(`Processing ${type} email for product: ${productTitle} to: ${userEmail}`);
    
    let subject = "";
    let htmlContent = "";
    
    // Format current date for the email
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Common styling for emails
    const headerStyle = "font-size: 24px; font-weight: bold; color: #8B5CF6; margin-bottom: 20px; font-family: 'Exo 2', Arial, sans-serif;";
    const paragraphStyle = "font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 16px; font-family: Arial, sans-serif;";
    const buttonStyle = "display: inline-block; background-image: linear-gradient(to right, #8B5CF6, #D946EF); color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; font-family: Arial, sans-serif;";
    const noteStyle = "font-size: 14px; color: #6B7280; margin-top: 30px; font-style: italic; font-family: Arial, sans-serif;";
    const sectionStyle = "background-color: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #8B5CF6;";
    
    switch (type) {
      case 'submitted':
        subject = `Your AI Product "${productTitle}" Has Been Submitted`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <img src="https://pxadbwlidclnfoodjtpd.supabase.co/storage/v1/object/public/product-images/ai-exchange-logo.png" alt="AI Exchange Logo" style="width: 100px; margin-bottom: 20px;">
            <h1 style="${headerStyle}">Submission Received!</h1>
            <p style="${paragraphStyle}">Hi ${firstName},</p>
            <p style="${paragraphStyle}">Thank you for submitting your AI product <strong>"${productTitle}"</strong> to the AI Exchange marketplace on ${formattedDate}.</p>
            
            <div style="${sectionStyle}">
              <p style="${paragraphStyle}"><strong>Next Steps:</strong></p>
              <p style="${paragraphStyle}">1. Our team will review your listing within the next 24-48 hours</p>
              <p style="${paragraphStyle}">2. You'll receive another email once your product is approved or if we need additional information</p>
              <p style="${paragraphStyle}">3. After approval, your product will be live on our marketplace</p>
            </div>
            
            <p style="${paragraphStyle}">While you wait, you can prepare additional materials or review your current listing in your dashboard.</p>
            
            <a href="https://www.aiexchange.pro/product-dashboard" style="${buttonStyle}">View Your Dashboard</a>
            
            <p style="${noteStyle}">If you have any questions, simply reply to this email or contact our support team.</p>
          </div>
        `;
        break;
        
      case 'approved':
        subject = `Congratulations! Your Product "${productTitle}" Is Now Live`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <img src="https://pxadbwlidclnfoodjtpd.supabase.co/storage/v1/object/public/product-images/ai-exchange-logo.png" alt="AI Exchange Logo" style="width: 100px; margin-bottom: 20px;">
            <h1 style="${headerStyle}">Great News!</h1>
            <p style="${paragraphStyle}">Hi ${firstName},</p>
            <p style="${paragraphStyle}">We're excited to inform you that your AI product <strong>"${productTitle}"</strong> has been approved and is now live on the AI Exchange marketplace!</p>
            
            <div style="${sectionStyle}">
              <p style="${paragraphStyle}"><strong>What's Next:</strong></p>
              <p style="${paragraphStyle}">• Your product is now visible to all potential buyers on our platform</p>
              <p style="${paragraphStyle}">• You'll receive notifications when users interact with your listing</p>
              <p style="${paragraphStyle}">• Check your dashboard regularly to track performance and manage inquiries</p>
            </div>
            
            <p style="${paragraphStyle}">To maximize visibility and increase your chances of a successful sale, consider:</p>
            <ul style="${paragraphStyle}">
              <li>Adding more details or screenshots to your listing</li>
              <li>Responding quickly to any buyer inquiries</li>
              <li>Sharing your listing on social media</li>
            </ul>
            
            <a href="https://www.aiexchange.pro/marketplace/${productId}" style="${buttonStyle}">View Your Live Listing</a>
            
            <p style="${noteStyle}">We're thrilled to have your product on our platform and look forward to helping you connect with the right buyers!</p>
          </div>
        `;
        break;
        
      case 'rejected':
        subject = `Important Update About Your Product "${productTitle}"`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <img src="https://pxadbwlidclnfoodjtpd.supabase.co/storage/v1/object/public/product-images/ai-exchange-logo.png" alt="AI Exchange Logo" style="width: 100px; margin-bottom: 20px;">
            <h1 style="${headerStyle}">Listing Update Required</h1>
            <p style="${paragraphStyle}">Hi ${firstName},</p>
            <p style="${paragraphStyle}">Thank you for submitting your AI product <strong>"${productTitle}"</strong> to the AI Exchange marketplace.</p>
            
            <p style="${paragraphStyle}">After careful review, we've found that some aspects of your listing need to be addressed before it can go live on our platform.</p>
            
            <div style="${sectionStyle}">
              <p style="${paragraphStyle}"><strong>Feedback from our review team:</strong></p>
              <p style="${paragraphStyle}">${feedback || "Please review our listing guidelines and update your submission accordingly."}</p>
            </div>
            
            <p style="${paragraphStyle}">This is quite common and easy to fix! You can update your listing through your dashboard and resubmit it for review.</p>
            
            <a href="https://www.aiexchange.pro/product-dashboard" style="${buttonStyle}">Update Your Listing</a>
            
            <p style="${paragraphStyle}">If you have any questions about the feedback or need assistance with your listing, our support team is ready to help.</p>
            
            <p style="${noteStyle}">We appreciate your understanding and look forward to featuring your product on our marketplace soon!</p>
          </div>
        `;
        break;
    }
    
    console.log(`Sending ${type} email to ${userEmail}`);
    
    const emailResponse = await resend.emails.send({
      from: "AI Exchange Club <noreply@aiexchange.club>",
      to: [userEmail],
      subject: subject,
      html: htmlContent,
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
    console.error("Error in send-listing-notification function:", error);
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
