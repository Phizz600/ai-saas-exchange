
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Get the publishable key from environment variables
    const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    
    if (!publishableKey) {
      console.error("STRIPE_PUBLISHABLE_KEY is not configured in environment variables");
      throw new Error("Stripe is not properly configured. Please contact support.");
    }
    
    console.log("Successfully retrieved Stripe publishable key");
    
    // Return the publishable key
    return new Response(
      JSON.stringify({ 
        publishableKey,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error retrieving Stripe publishable key:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
