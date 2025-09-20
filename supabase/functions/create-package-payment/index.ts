import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno&deno-std=0.190.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { packageType } = await req.json();

    if (!packageType) {
      return new Response(
        JSON.stringify({ error: 'Package type is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Define package pricing
    const packagePricing = {
      'featured-listing': { amount: 19900, name: 'Featured Listing Package' }, // $199.00
      'premium-exit': { amount: 250000, name: 'Premium Exit Package' },   // $2,500.00
      'featured-listing-downsell': { amount: 9950, name: 'Featured Listing Package (50% Off)' }, // $99.50
      'premium-exit-downsell': { amount: 125000, name: 'Premium Exit Package (50% Off)' }   // $1,250.00
    };

    const selectedPackage = packagePricing[packageType as keyof typeof packagePricing];
    
    if (!selectedPackage) {
      return new Response(
        JSON.stringify({ error: 'Invalid package type' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Creating payment intent for ${selectedPackage.name}: $${selectedPackage.amount / 100}`);

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPackage.amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        packageType: packageType,
        packageName: selectedPackage.name,
        environment: Deno.env.get('ENVIRONMENT') || 'development'
      }
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating package payment intent:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create payment intent' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});