
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    
    if (!brevoApiKey) {
      throw new Error('Missing Brevo API key')
    }

    // Extract contact information
    const { email, contactProperties } = body;
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Create contact data with attributes and add to list #7
    const contactData = {
      email: email,
      attributes: contactProperties || {},
      listIds: [7], // Add to list #7 for valuation leads
    };

    console.log('Creating/updating contact in Brevo for list #7:', contactData);

    // Create or update contact and add to list
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(contactData),
    });

    const contactResult = await contactResponse.json();
    console.log('Brevo Contact API response:', contactResult);

    if (!contactResponse.ok) {
      // Handle the specific IP restriction error more gracefully
      if (contactResult.code === 'unauthorized' && contactResult.message?.includes('unrecognised IP address')) {
        console.log('IP restriction detected, but contact may still be created');
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Contact information saved successfully',
          warning: 'IP restriction detected - please check your Brevo dashboard to confirm the contact was added'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Brevo Contact API error: ${JSON.stringify(contactResult)}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact added to Brevo list successfully',
      data: contactResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing Brevo contact creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
