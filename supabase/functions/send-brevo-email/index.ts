
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
    const { event, recipient, templateId, params } = await req.json()
    
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    if (!brevoApiKey) {
      throw new Error('Missing Brevo API key')
    }

    console.log(`Processing ${event} event for email: ${recipient}`)

    // Map event types to template IDs if not explicitly provided
    let resolvedTemplateId = templateId
    if (!resolvedTemplateId) {
      const templateMapping = {
        'user_signup': 1,            // Example template ID for signup
        'product_listed': 2,         // Example template ID for product listing
        'offer_received': 3,         // Example template ID for offer
        'pitch_deck_generated': 4,   // Example template ID for pitch deck
      }
      
      resolvedTemplateId = templateMapping[event] || 1 // Default to template 1
    }

    // Send email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        templateId: resolvedTemplateId,
        to: [{ email: recipient }],
        params: params || {},
      }),
    })

    const data = await response.json()
    console.log('Brevo API response:', data)

    if (!response.ok) {
      throw new Error(`Brevo API error: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email sent successfully for event: ${event}`,
      data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending email via Brevo:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
