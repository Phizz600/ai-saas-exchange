
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

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
    console.log("Starting stripe-payment-verify function");
    
    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured in environment variables");
      throw new Error("Payment system is not properly configured. Please contact support.");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });
    
    console.log("Initialized Stripe client successfully");
    
    // Get request body
    const requestData = await req.json();
    const { paymentIntentId } = requestData;
    
    // Log input parameters
    console.log("Stripe Payment Verify Request:", { paymentIntentId });
    
    // Validate inputs
    if (!paymentIntentId) {
      console.error("Missing payment intent ID");
      return new Response(
        JSON.stringify({ error: "Missing payment intent ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    try {
      // Retrieve the payment intent to check its status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      console.log(`Retrieved payment intent ${paymentIntentId}:`, {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      });
      
      // Return the payment intent status and details
      return new Response(
        JSON.stringify({ 
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100, // Convert from cents to dollars
          metadata: paymentIntent.metadata,
          created: new Date(paymentIntent.created * 1000).toISOString(),
          customer: paymentIntent.customer,
          latest_charge: paymentIntent.latest_charge
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (stripeError) {
      console.error("Error retrieving Stripe payment intent:", stripeError);
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: "stripe_error",
          code: stripeError.code
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
  } catch (error) {
    console.error("General error verifying payment intent:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: "server_error"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
