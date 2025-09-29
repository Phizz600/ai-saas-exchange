import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe is not properly configured");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { userId, amount } = await req.json();
    
    if (!userId || !amount) {
      throw new Error("Missing required parameters");
    }
    
    // Create a setup intent for future payments (subscription)
    const setupIntent = await stripe.setupIntents.create({
      customer: undefined, // You might want to create/retrieve a customer here
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId,
        subscriptionType: 'marketplace-subscription',
        amount: amount.toString(),
      },
    });
    
    console.log("Created setup intent:", setupIntent.id);
    
    return new Response(
      JSON.stringify({ 
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error creating subscription:", error);
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