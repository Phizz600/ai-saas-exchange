import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing service role key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing Resend API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create admin client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get product ID from request
    const { productId } = await req.json();
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Missing product ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        *,
        seller:seller_id(email, full_name),
        highest_bidder:highest_bidder_id(email, full_name)
      `)
      .eq("id", productId)
      .single();
      
    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found", details: productError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get all bidders for this product
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select(`
        amount,
        bidder:bidder_id(email, full_name)
      `)
      .eq("product_id", productId)
      .eq("status", "active")
      .order("amount", { ascending: false });
      
    if (bidsError) {
      return new Response(
        JSON.stringify({ error: "Error fetching bids", details: bidsError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Compile list of email recipients
    const recipients = [];
    
    // Seller
    if (product.seller && product.seller.email) {
      recipients.push({
        email: product.seller.email,
        name: product.seller.full_name || "Seller",
        type: "seller",
        won: false
      });
    }
    
    // Winner (highest bidder)
    if (product.highest_bidder && product.highest_bidder.email) {
      recipients.push({
        email: product.highest_bidder.email,
        name: product.highest_bidder.full_name || "Winning Bidder",
        type: "winner",
        won: true
      });
    }
    
    // Other bidders
    for (const bid of bids) {
      if (bid.bidder && bid.bidder.email && bid.bidder.email !== product.highest_bidder?.email) {
        recipients.push({
          email: bid.bidder.email,
          name: bid.bidder.full_name || "Bidder",
          type: "bidder",
          won: false
        });
      }
    }
    
    // Send emails to all recipients
    const emailResults = [];
    
    for (const recipient of recipients) {
      // Create appropriate subject and content based on recipient type
      let subject = "";
      let htmlContent = "";
      
      if (recipient.type === "seller") {
        if (product.highest_bid) {
          subject = `[AI Exchange] Your auction for ${product.title} has ended with a winning bid`;
          htmlContent = `
            <h2>Your auction has ended successfully!</h2>
            <p>Your product <strong>${product.title}</strong> has received a winning bid of $${product.highest_bid}.</p>
            <p>The winner is: ${product.highest_bidder?.full_name || "Anonymous Bidder"}</p>
            <p>You can now proceed with the transaction by visiting the conversation with the buyer.</p>
            <p><a href="https://aiexchange.club/messages">Go to Messages</a></p>
          `;
        } else {
          subject = `[AI Exchange] Your auction for ${product.title} has ended without bids`;
          htmlContent = `
            <h2>Your auction has ended</h2>
            <p>Your product <strong>${product.title}</strong> did not receive any bids.</p>
            <p>You can relist your product or change your pricing strategy and try again.</p>
            <p><a href="https://aiexchange.club/account/products">Manage Your Products</a></p>
          `;
        }
      } else if (recipient.type === "winner") {
        subject = `[AI Exchange] Congratulations! You won the auction for ${product.title}`;
        htmlContent = `
          <h2>Congratulations! You're the winning bidder!</h2>
          <p>You've won the auction for <strong>${product.title}</strong> with your bid of $${product.highest_bid}.</p>
          <p>You can now proceed with the transaction by visiting your conversation with the seller.</p>
          <p><a href="https://aiexchange.club/messages">Go to Messages</a></p>
        `;
      } else {
        subject = `[AI Exchange] Auction ended for ${product.title}`;
        htmlContent = `
          <h2>Auction Update</h2>
          <p>The auction for <strong>${product.title}</strong> has ended.</p>
          <p>The winning bid was $${product.highest_bid || "N/A - No winning bid"}.</p>
          <p>Thank you for your participation. Keep browsing for more great products!</p>
          <p><a href="https://aiexchange.club/marketplace">Browse Marketplace</a></p>
        `;
      }
      
      try {
        // Send email using Resend
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: "AI Exchange <notifications@aiexchange.club>",
            to: recipient.email,
            subject: subject,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(to right, #D946EE, #8B5CF6, #0EA4E9); padding: 20px; color: white; text-align: center; }
                  .content { padding: 20px; background: #f9f9f9; }
                  .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                  a { color: #8B5CF6; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>AI Exchange</h1>
                  </div>
                  <div class="content">
                    ${htmlContent}
                  </div>
                  <div class="footer">
                    <p>AI Exchange - The marketplace for AI projects and businesses</p>
                    <p>© ${new Date().getFullYear()} AI Exchange. All rights reserved.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
        });
        
        const responseData = await response.json();
        emailResults.push({
          recipient: recipient.email,
          type: recipient.type,
          success: response.ok,
          data: responseData
        });
        
      } catch (emailError) {
        console.error(`Error sending email to ${recipient.email}:`, emailError);
        emailResults.push({
          recipient: recipient.email,
          type: recipient.type,
          success: false,
          error: emailError.message
        });
      }
    }
    
    // Update product to mark email notification as sent
    await supabase
      .from("products")
      .update({
        auction_status: "notification_sent",
        updated_at: new Date().toISOString()
      })
      .eq("id", productId);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        recipients_count: recipients.length,
        success_count: emailResults.filter(r => r.success).length,
        results: emailResults
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: any) {
    console.error("Error in send-auction-result function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
