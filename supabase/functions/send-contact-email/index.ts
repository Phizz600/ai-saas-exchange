
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
    
    // Send the email using Resend with improved HTML template inspired by Notion/Netflix
    const response = await resend.emails.send({
      from: 'AI Exchange <khalid@aiexchange.club>',
      to: ['support@aiexchange.club'],
      reply_to: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Contact Form Submission</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f9f9fa;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
              color: #333333;
            }
            
            .container {
              max-width: 580px;
              margin: 0 auto;
              padding: 20px;
            }
            
            .content {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(to right, #13293D, #0EA4E9);
              padding: 24px;
              text-align: left;
            }
            
            .header h1 {
              color: white;
              margin: 0;
              font-size: 20px;
              font-weight: 600;
              letter-spacing: -0.02em;
            }
            
            .body {
              padding: 24px;
            }
            
            .message-section {
              background-color: #f7f9fc;
              border-radius: 6px;
              padding: 16px;
              margin-top: 16px;
              border-left: 4px solid #0EA4E9;
            }
            
            .message-content {
              margin: 0;
              font-size: 15px;
              line-height: 1.6;
              white-space: pre-wrap;
            }
            
            .field {
              margin-bottom: 16px;
            }
            
            .field-name {
              font-size: 13px;
              color: #666666;
              margin-bottom: 4px;
              font-weight: 600;
            }
            
            .field-value {
              font-size: 15px;
              margin: 0;
              color: #333333;
            }
            
            .footer {
              border-top: 1px solid #EAEAEA;
              padding: 24px;
              font-size: 12px;
              color: #666666;
              text-align: center;
            }
            
            .footer p {
              margin: 0 0 8px 0;
            }
            
            .logo {
              opacity: 0.8;
              margin-bottom: 8px;
            }
            
            @media only screen and (max-width: 620px) {
              .container {
                padding: 12px;
              }
              
              .header, .body, .footer {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="body">
                <div class="field">
                  <div class="field-name">FROM</div>
                  <p class="field-value">${name} &lt;${email}&gt;</p>
                </div>
                
                <div class="field">
                  <div class="field-name">SUBJECT</div>
                  <p class="field-value">${subject}</p>
                </div>
                
                <div class="field">
                  <div class="field-name">MESSAGE</div>
                  <div class="message-section">
                    <p class="message-content">${message.replace(/\n/g, '<br>')}</p>
                  </div>
                </div>
              </div>
              <div class="footer">
                <p>This message was sent from the contact form at AI Exchange.</p>
                <p>You can reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
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
