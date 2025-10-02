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
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }
    
    // Fixed price for marketplace subscription: $49.95/month
    const amount = 4995; // in cents
    
    // Create a payment intent with automatic payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.id,
        subscriptionType: 'marketplace-premium',
        type: 'subscription',
      },
    });
    
    console.log("Created payment intent for subscription:", paymentIntent.id);
    
    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        subscriptionId: paymentIntent.id
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