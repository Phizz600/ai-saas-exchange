
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
    console.log("Starting verify-payment-intent function");
    
    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured in environment variables");
      throw new Error("Payment system is not properly configured. Please contact support.");
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
    
    console.log("Initialized Stripe and Supabase clients successfully");
    
    // Get request body
    const { paymentIntentId, recordType, recordId } = await req.json();
    
    // Validate inputs
    if (!paymentIntentId) {
      console.error("Missing payment intent ID");
      return new Response(
        JSON.stringify({ error: "Missing payment intent ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!recordType || !['offer', 'bid'].includes(recordType)) {
      console.error("Invalid or missing record type");
      return new Response(
        JSON.stringify({ error: "Invalid or missing record type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!recordId) {
      console.error("Missing record ID");
      return new Response(
        JSON.stringify({ error: "Missing record ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Verifying payment intent ${paymentIntentId} for ${recordType} ${recordId}`);
    
    try {
      // Retrieve the payment intent to check its status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      console.log(`Retrieved payment intent ${paymentIntentId} with status: ${paymentIntent.status}`);
      
      // Verify the payment status and update the record
      let isAuthorized = false;
      let status = 'pending';
      
      if (paymentIntent.status === 'requires_capture' || paymentIntent.status === 'succeeded') {
        isAuthorized = true;
        status = 'authorized';
      } else if (paymentIntent.status === 'canceled') {
        status = 'cancelled';
      } else if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'requires_confirmation') {
        status = 'pending';
      } else if (paymentIntent.status === 'processing') {
        status = 'processing';
      } else {
        status = 'failed';
      }
      
      console.log(`Payment authorization status: ${status}, isAuthorized: ${isAuthorized}`);
      
      // Update the record in the database
      if (recordType === 'offer') {
        const { error } = await supabase
          .from('offers')
          .update({
            payment_status: status,
            deposit_status: isAuthorized ? 'deposited' : 'pending'
          })
          .eq('id', recordId)
          .eq('payment_intent_id', paymentIntentId);
        
        if (error) {
          console.error(`Error updating offer: ${error.message}`);
          throw error;
        }
      } else if (recordType === 'bid') {
        const { error } = await supabase
          .from('bids')
          .update({
            payment_status: status,
            deposit_status: isAuthorized ? 'deposited' : 'pending',
            status: isAuthorized ? 'active' : 'pending'
          })
          .eq('id', recordId)
          .eq('payment_intent_id', paymentIntentId);
        
        if (error) {
          console.error(`Error updating bid: ${error.message}`);
          throw error;
        }
      }
      
      // Return the payment intent status and verification result
      return new Response(
        JSON.stringify({
          paymentIntentId,
          status: paymentIntent.status,
          isAuthorized,
          amount: paymentIntent.amount / 100,
          metadata: paymentIntent.metadata,
          recordType,
          recordId
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (stripeError) {
      console.error(`Error retrieving payment intent: ${stripeError.message}`);
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: "stripe_error",
          code: stripeError.code
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
  } catch (error) {
    console.error(`General error: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: "server_error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
