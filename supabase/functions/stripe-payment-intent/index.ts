
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

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
    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured in environment variables");
      throw new Error("Payment system is not properly configured. Please contact support.");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });
    
    // Get request body
    const { amount, bidId, productId, mode } = await req.json();
    
    // Log input parameters
    console.log("Stripe Payment Intent Request:", { amount, bidId, productId, mode });
    
    // Validate inputs
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!bidId) {
      return new Response(
        JSON.stringify({ error: "Missing bid ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Convert amount to cents for Stripe (ensuring it's an integer)
    const amountInCents = Math.round(amount * 100);
    
    console.log(`Creating payment intent for ${amountInCents} cents`);
    
    // Create a payment intent with capture_method: manual for auth-only mode
    const paymentIntentOptions = {
      amount: amountInCents,
      currency: "usd",
      capture_method: "manual", // This makes it an authorization only
      metadata: {
        bidId,
        productId,
        environment: Deno.env.get("ENVIRONMENT") || "development",
      },
      description: `Bid Authorization for product ID: ${productId}`,
      statement_descriptor_suffix: "AIBID"  // Use suffix instead of full descriptor
    };
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
    
    console.log("Created payment intent:", paymentIntent.id);
    
    // Return the client secret
    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
