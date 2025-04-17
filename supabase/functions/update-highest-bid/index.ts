
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const { productId, bidAmount, bidderId } = await req.json();
    
    // Validate inputs
    if (!productId || !bidAmount || !bidderId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: productId, bidAmount, or bidderId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Processing bid for Dutch auction: Product ${productId}, Amount: ${bidAmount}, Bidder: ${bidderId}`);
    
    // Get current product information
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('highest_bid, current_price, starting_price, reserve_price, price_decrement, price_decrement_interval, created_at, title, highest_bidder_id, auction_end_time, listing_type')
      .eq('id', productId)
      .single();
    
    if (productError) {
      console.error(`Error fetching product: ${productError.message}`);
      return new Response(
        JSON.stringify({ error: `Error fetching product: ${productError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if this is a Dutch auction
    const isDutchAuction = product.listing_type === 'dutch_auction';
    
    if (!isDutchAuction) {
      console.log("Not a Dutch auction, skipping special handling");
      return new Response(
        JSON.stringify({ success: false, message: "Not a Dutch auction" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch the bid to make sure it exists, is authorized and active
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('id, payment_status, status')
      .eq('product_id', productId)
      .eq('bidder_id', bidderId)
      .eq('amount', bidAmount)
      .eq('payment_status', 'authorized') // Only accept authorized bids
      .eq('status', 'active')             // Only accept active bids
      .single();
    
    if (bidError) {
      console.error(`Error fetching bid or bid not authorized: ${bidError.message}`);
      return new Response(
        JSON.stringify({ error: `Error fetching bid or bid not properly authorized: ${bidError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Double-check that the bid is active and payment is authorized
    if (bid.status !== 'active' || bid.payment_status !== 'authorized') {
      console.log(`Bid is not valid for Dutch auction win: status=${bid.status}, payment_status=${bid.payment_status}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Bid is not active or payment is not authorized",
          bidStatus: bid.status,
          paymentStatus: bid.payment_status
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // For Dutch auctions, check if the bid meets the current price
    if (bidAmount < product.current_price) {
      console.log(`Bid amount ${bidAmount} is less than current auction price ${product.current_price}. Rejecting.`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Bid amount must be at least the current auction price",
          bidAmount: bidAmount,
          currentPrice: product.current_price
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // In Dutch auction, first authorized bid wins and ends the auction
    console.log(`Valid bid received for Dutch auction. Ending auction with winner: ${bidderId}`);
    
    // Calculate auction end time (now or slightly in the future to allow time for db triggers)
    const auctionEndTime = new Date();
    auctionEndTime.setMinutes(auctionEndTime.getMinutes() + 2); // Add 2 minutes to allow for transaction processing
    
    // Update product with winning bid and end the auction
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        highest_bid: bidAmount,
        highest_bidder_id: bidderId,
        current_price: bidAmount, // Set current price to the winning bid amount
        auction_end_time: auctionEndTime.toISOString(), // End the auction immediately
        status: 'ended' // Mark the auction as ended
      })
      .eq('id', productId)
      .select();
    
    if (updateError) {
      console.error(`Error updating product: ${updateError.message}`);
      return new Response(
        JSON.stringify({ error: `Error updating product: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create notification for the seller
    try {
      const { data: seller } = await supabase
        .from('products')
        .select('seller_id, title')
        .eq('id', productId)
        .single();
        
      if (seller) {
        await supabase
          .from('notifications')
          .insert({
            user_id: seller.seller_id,
            title: 'Dutch Auction Completed!',
            message: `Your auction for "${seller.title}" has ended with a winning bid of $${bidAmount.toLocaleString()}.`,
            type: 'auction_ended',
            related_product_id: productId
          });
      }
    } catch (notificationError) {
      console.error("Error creating seller notification:", notificationError);
      // We don't want to fail the whole process if just the notification fails
    }
    
    // Create notification for the winning bidder
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: bidderId,
          title: 'You Won the Dutch Auction!',
          message: `Congratulations! You've won the Dutch auction for product "${product.title}" with your bid of $${bidAmount.toLocaleString()}.`,
          type: 'auction_won',
          related_product_id: productId
        });
    } catch (notificationError) {
      console.error("Error creating bidder notification:", notificationError);
      // We don't want to fail the whole process if just the notification fails
    }
    
    console.log(`Successfully ended Dutch auction for product ${productId} with winning bid: ${bidAmount}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Dutch auction ended successfully with winning bid",
        bidAmount: bidAmount,
        bidderId: bidderId,
        auctionEndTime: auctionEndTime.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
