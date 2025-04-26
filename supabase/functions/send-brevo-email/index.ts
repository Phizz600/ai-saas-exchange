
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

    // First create/update contact and add to list
    const contactData = {
      email: body.identifiers.email,
      attributes: body.contactProperties || {},
      listIds: [5], // Free Valuation #5 list
    };

    console.log('Creating/updating contact in Brevo:', contactData);

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
    console.log('Contact API response:', contactResult);

    if (!contactResponse.ok) {
      throw new Error(`Brevo Contact API error: ${JSON.stringify(contactResult)}`);
    }

    // Then track the event
    if (body.mode === 'track_event_api') {
      const { eventName, identifiers, contactProperties, eventProperties } = body;
      
      if (!eventName || !identifiers) {
        throw new Error('Missing required parameters: eventName and identifiers');
      }

      console.log(`Tracking event via API: ${eventName}`, JSON.stringify(identifiers));
      console.log(`Contact properties:`, JSON.stringify(contactProperties || {}));
      console.log(`Event properties:`, JSON.stringify(eventProperties || {}));
      
      const response = await fetch('https://api.brevo.com/v3/events', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          event_name: eventName,
          identifiers: identifiers,
          contact_properties: contactProperties || {},
          event_properties: eventProperties || {}
        }),
      });

      const data = await response.json();
      console.log('Brevo Events API response:', data);

      if (!response.ok) {
        throw new Error(`Brevo Events API error: ${JSON.stringify(data)}`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Contact created/updated and event tracked successfully: ${eventName}`,
        data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Invalid mode or missing parameters');
    }
  } catch (error) {
    console.error('Error processing Brevo request:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
