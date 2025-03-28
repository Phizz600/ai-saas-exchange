
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
    
    // Send the email using Resend with improved HTML template
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
            @media only screen and (max-width: 620px) {
              table.body h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }
              table.body p,
              table.body ul,
              table.body ol,
              table.body td,
              table.body span,
              table.body a {
                font-size: 16px !important;
              }
              table.body .wrapper,
              table.body .article {
                padding: 10px !important;
              }
              table.body .content {
                padding: 0 !important;
              }
              table.body .container {
                padding: 0 !important;
                width: 100% !important;
              }
              table.body .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
              }
            }
          </style>
        </head>
        <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
            <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
                  <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
                    <tr>
                      <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                          <tr>
                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                              <div style="border-bottom: 1px solid #e6e6e6; margin-bottom: 20px; padding-bottom: 10px;">
                                <h1 style="color: #13293D; font-family: sans-serif; font-weight: 700; margin: 0; margin-bottom: 15px;">Contact Form Submission</h1>
                              </div>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;"><strong style="color: #13293D;">From:</strong> ${name} (${email})</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;"><strong style="color: #13293D;">Subject:</strong> ${subject}</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><strong style="color: #13293D;">Message:</strong></p>
                              <div style="background-color: #f9f9f9; border-left: 4px solid #0EA4E9; padding: 15px; margin-bottom: 20px;">
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                              </div>
                              <p style="font-family: sans-serif; font-size: 12px; color: #999999; font-weight: normal; margin: 0;">This message was sent via the contact form on AI Exchange.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            </tr>
          </table>
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
