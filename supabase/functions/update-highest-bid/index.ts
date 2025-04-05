
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
    
    // Only update if the new bid is higher than the current highest bid
    if (!product.highest_bid || bidAmount > product.highest_bid) {
      console.log(`Updating bid: Current highest: ${product.highest_bid || 'None'}, New bid: ${bidAmount}`);
      
      // Always set current_price to match the highest bid in Dutch auctions
      const { data, error: updateError } = await supabase
        .from('products')
        .update({
          highest_bid: bidAmount,
          highest_bidder_id: bidderId,
          current_price: bidAmount  // This ensures current_price always equals the highest bid
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
