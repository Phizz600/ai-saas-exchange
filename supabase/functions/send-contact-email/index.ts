
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { Resend } from "npm:resend@2.0.0"

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
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error('Missing required form fields')
    }
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Server configuration error: Missing API key' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Processing contact form submission from ${name} (${email})`)
    console.log(`Subject: ${subject}`)
    
    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);
    
    // Send the email using Resend
    const response = await resend.emails.send({
      from: 'AI Exchange <khalid@aiexchange.club>',
      to: ['support@aiexchange.club'],
      reply_to: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('Contact email sent successfully:', response);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Your message has been sent successfully!',
      data: response
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
