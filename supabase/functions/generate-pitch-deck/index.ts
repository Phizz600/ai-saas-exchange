
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
    const { title, description, category, stage, monthlyRevenue } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key')
    }

    console.log('Generating pitch deck for:', { title, category })

    const prompt = `Create a compelling pitch deck for the following AI product:
    Title: ${title}
    Description: ${description}
    Category: ${category}
    Stage: ${stage}
    Monthly Revenue: $${monthlyRevenue || 0}

    Generate 5 slides with the following structure:
    1. Problem & Solution
    2. Market Opportunity
    3. Product Features
    4. Business Model
    5. Growth Strategy

    Format each slide with a title and bullet points.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert at creating compelling pitch decks for AI products. Format your response as JSON with an array of slides, each containing a title and content array.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    console.log('Generated pitch deck response:', data)
    
    // Track the pitch deck generation event in Brevo
    try {
      const brevoApiKey = Deno.env.get('BREVO_API_KEY')
      if (brevoApiKey) {
        await fetch('https://in-automate.brevo.com/api/v2/trackEvent', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'pitch_deck_generated',
            properties: {
              title,
              category,
              stage
            },
            eventdata: {
              id: crypto.randomUUID(),
              data: {
                description,
                monthlyRevenue: monthlyRevenue || 0
              }
            }
          }),
        });
        console.log('Pitch deck generation event tracked in Brevo');
      }
    } catch (trackingError) {
      console.error('Error tracking event in Brevo:', trackingError);
      // Non-blocking error - continue with response
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error generating pitch deck:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
