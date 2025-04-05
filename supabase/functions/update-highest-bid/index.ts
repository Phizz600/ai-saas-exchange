
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
    
    console.log(`Processing bid update: Product ${productId}, Amount: ${bidAmount}, Bidder: ${bidderId}`);
    
    // Get current product information
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('highest_bid, current_price, starting_price, min_price, price_decrement, price_decrement_interval, created_at')
      .eq('id', productId)
      .single();
    
    if (productError) {
      console.error(`Error fetching product: ${productError.message}`);
      return new Response(
        JSON.stringify({ error: `Error fetching product: ${productError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch the bid to make sure it exists, is properly authorized and active
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('id, payment_status, status')
      .eq('product_id', productId)
      .eq('bidder_id', bidderId)
      .eq('amount', bidAmount)
      .eq('payment_status', 'authorized') // Only accept authorized bids
      .eq('status', 'active')             // Only accept active bids
      .is('status', 'not.cancelled')      // Explicitly exclude cancelled bids
      .is('payment_status', 'not.cancelled') // Explicitly exclude cancelled payments
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
      console.log(`Bid is not valid for highest bid update: status=${bid.status}, payment_status=${bid.payment_status}`);
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
    
    // Check if there are any existing authorized higher bids that are also active
    const { data: higherBids, error: higherBidsError } = await supabase
      .from('bids')
      .select('amount')
      .eq('product_id', productId)
      .eq('status', 'active')
      .eq('payment_status', 'authorized')
      .gt('amount', bidAmount)
      .order('amount', { ascending: false })
      .limit(1);
      
    if (higherBidsError) {
      console.error(`Error checking for higher bids: ${higherBidsError.message}`);
    }
    
    if (higherBids && higherBids.length > 0) {
      console.log(`Found a higher authorized bid: ${higherBids[0].amount}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "A higher authorized bid already exists",
          currentHighestBid: higherBids[0].amount,
          submittedBid: bidAmount
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Only update if the new bid is higher than the current highest bid
    if (!product.highest_bid || bidAmount > product.highest_bid) {
      console.log(`Updating bid: Current highest: ${product.highest_bid || 'None'}, New bid: ${bidAmount}`);
      
      // IMPORTANT: Always set current_price equal to the new highest bid
      const { data, error: updateError } = await supabase
        .from('products')
        .update({
          highest_bid: bidAmount,
          highest_bidder_id: bidderId,
          current_price: bidAmount  // Current price should always match the highest bid
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
      
      console.log(`Successfully updated product with new bid: ${bidAmount}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Highest bid updated successfully",
          previousBid: product.highest_bid,
          newBid: bidAmount,
          currentPrice: bidAmount // Added to response for clarity
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log(`Bid not higher than current highest: Current: ${product.highest_bid}, Submitted: ${bidAmount}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Bid not higher than current highest bid",
          currentHighestBid: product.highest_bid,
          submittedBid: bidAmount
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
