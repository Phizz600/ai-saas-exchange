
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS");
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    console.log("Receiving Stripe webhook request");
    
    // Get the stripe webhook secret from environment variables
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeWebhookSecret) {
      console.error("Missing Stripe webhook secret");
      throw new Error("Missing Stripe webhook secret");
    }

    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      throw new Error("Missing Stripe secret key");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request body as text for signature verification
    const body = await req.text();
    
    // Get the signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No Stripe signature found in request");
      throw new Error("No Stripe signature found in request");
    }
    
    console.log("Verifying webhook signature");
    
    // Verify the event using the webhook secret and signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Received Stripe event: ${event.type}`);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object, supabase);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object, supabase);
        break;
        
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object, supabase);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    console.log("Webhook processed successfully");
    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error(`Webhook error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Handler for successful payments
async function handlePaymentIntentSucceeded(paymentIntent, supabase) {
  const paymentIntentId = paymentIntent.id;
  console.log(`Processing successful payment: ${paymentIntentId}`);
  
  try {
    // Check if this is related to an offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();
      
    if (offer && !offerError) {
      console.log(`Updating offer ${offer.id} payment status to succeeded`);
      await supabase
        .from('offers')
        .update({
          payment_status: 'succeeded',
          deposit_status: 'deposited'
        })
        .eq('id', offer.id);
        
      return;
    }
    
    // Check if this is related to a bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();
      
    if (bid && !bidError) {
      console.log(`Updating bid ${bid.id} payment status to succeeded`);
      await supabase
        .from('bids')
        .update({
          payment_status: 'succeeded',
          deposit_status: 'deposited',
          status: 'active'
        })
        .eq('id', bid.id);
        
      return;
    }
    
    console.log(`No offer or bid found for payment intent: ${paymentIntentId}`);
    
  } catch (error) {
    console.error(`Error processing successful payment: ${error.message}`);
    throw error;
  }
}

// Handler for failed payments
async function handlePaymentIntentFailed(paymentIntent, supabase) {
  const paymentIntentId = paymentIntent.id;
  console.log(`Processing failed payment: ${paymentIntentId}`);
  
  try {
    // Check if this is related to an offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();
      
    if (offer && !offerError) {
      console.log(`Updating offer ${offer.id} payment status to failed`);
      await supabase
        .from('offers')
        .update({
          payment_status: 'failed',
          deposit_status: 'failed'
        })
        .eq('id', offer.id);
        
      return;
    }
    
    // Check if this is related to a bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();
      
    if (bid && !bidError) {
      console.log(`Updating bid ${bid.id} payment status to failed`);
      await supabase
        .from('bids')
        .update({
          payment_status: 'failed',
          deposit_status: 'failed',
          status: 'cancelled'
        })
        .eq('id', bid.id);
        
      return;
    }
    
    console.log(`No offer or bid found for payment intent: ${paymentIntentId}`);
    
  } catch (error) {
    console.error(`Error processing failed payment: ${error.message}`);
    throw error;
  }
}

// Handler for canceled payments
async function handlePaymentIntentCanceled(paymentIntent, supabase) {
  const paymentIntentId = paymentIntent.id;
  console.log(`Processing canceled payment: ${paymentIntentId}`);
  
  try {
    // Check if this is related to an offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();
      
    if (offer && !offerError) {
      console.log(`Updating offer ${offer.id} payment status to canceled`);
      await supabase
        .from('offers')
        .update({
          payment_status: 'cancelled',
          deposit_status: 'cancelled'
        })
        .eq('id', offer.id);
        
      return;
    }
    
    // Check if this is related to a bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();
      
    if (bid && !bidError) {
      console.log(`Updating bid ${bid.id} payment status to canceled`);
      await supabase
        .from('bids')
        .update({
          payment_status: 'cancelled',
          deposit_status: 'cancelled',
          status: 'cancelled'
        })
        .eq('id', bid.id);
        
      return;
    }
    
    console.log(`No offer or bid found for payment intent: ${paymentIntentId}`);
    
  } catch (error) {
    console.error(`Error processing canceled payment: ${error.message}`);
    throw error;
  }
}
