
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";
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
    // Get the stripe signature from the headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the webhook secret
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });
    
    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.created':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent created: ${paymentIntent.id}`);
        
        // Update the bid with the payment intent ID
        if (paymentIntent.metadata.bidId) {
          const { error } = await supabase
            .from('bids')
            .update({ 
              payment_intent_id: paymentIntent.id,
              payment_status: 'authorized',
              payment_amount: paymentIntent.amount / 100 // Convert from cents to dollars
            })
            .eq('id', paymentIntent.metadata.bidId);
            
          if (error) {
            console.error(`Error updating bid: ${error.message}`);
          }
        }
        break;
        
      case 'payment_intent.succeeded':
        const succeededIntent = event.data.object;
        console.log(`PaymentIntent succeeded: ${succeededIntent.id}`);
        
        // Update the bid payment status
        if (succeededIntent.metadata.bidId) {
          const { error } = await supabase
            .from('bids')
            .update({ 
              payment_status: 'captured',
              payment_amount: succeededIntent.amount / 100 // Convert from cents to dollars
            })
            .eq('id', succeededIntent.metadata.bidId);
            
          if (error) {
            console.error(`Error updating bid: ${error.message}`);
          }
          
          // Get the bid details
          const { data: bid } = await supabase
            .from('bids')
            .select('product_id, amount, bidder_id')
            .eq('id', succeededIntent.metadata.bidId)
            .single();
            
          if (bid) {
            // Call the RPC function to update highest bid if higher
            const { error: rpcError } = await supabase.rpc('update_highest_bid_if_higher', {
              p_product_id: bid.product_id,
              p_bid_amount: bid.amount,
              p_bidder_id: bid.bidder_id
            });
            
            if (rpcError) {
              console.error(`Error updating highest bid: ${rpcError.message}`);
            }
          }
        }
        break;
        
      case 'payment_intent.canceled':
        const canceledIntent = event.data.object;
        console.log(`PaymentIntent canceled: ${canceledIntent.id}`);
        
        // Update the bid payment status
        if (canceledIntent.metadata.bidId) {
          const { error } = await supabase
            .from('bids')
            .update({ 
              payment_status: 'canceled',
              status: 'canceled'
            })
            .eq('id', canceledIntent.metadata.bidId);
            
          if (error) {
            console.error(`Error updating bid: ${error.message}`);
          }
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
