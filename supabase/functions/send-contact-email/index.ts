
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
    const { name, email, subject, message } = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error('Missing required form fields')
    }
    
    if (!brevoApiKey) {
      throw new Error('Missing Brevo API key')
    }

    console.log(`Processing contact form submission from ${name} (${email})`)
    console.log(`Subject: ${subject}`)
    
    // Use Brevo's API to send the email
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: name,
          email: email
        },
        to: [
          {
            name: 'AI Exchange Support',
            email: 'support@aiexchange.club'
          }
        ],
        replyTo: {
          name: name,
          email: email
        },
        subject: `Contact Form: ${subject}`,
        htmlContent: `
          <h3>Contact Form Submission</h3>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Error sending email via Brevo:', data)
      throw new Error(`Failed to send email: ${data.message || 'Unknown error'}`)
    }

    console.log('Contact email sent successfully:', data)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Your message has been sent successfully!',
      data 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing contact form submission:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
