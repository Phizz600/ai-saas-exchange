
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// Comprehensive list of disposable/temporary email domains
const disposableDomains = [
  // Common temporary email providers
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com', 
  'throwaway.email', 'temp-mail.org', 'yopmail.com', 'getnada.com',
  'maildrop.cc', 'sharklasers.com', 'trashmail.com', 'dispostable.com',
  'mailnesia.com', 'emailondeck.com', '33mail.com', 'fakeinbox.com',
  'tempail.com', 'mohmal.com', 'mytrashmail.com', 'emkei.cz',
  // Suspicious patterns
  '0-mail.com', '0815.ru', '20minutemail.com', '2prong.com',
  'armyspy.com', 'bugmenot.com', 'deadaddress.com', 'dropmail.me',
  'duck2.com', 'email60.com', 'emailfake.com', 'emailias.com',
  'emailmiser.com', 'emailsensei.com', 'emailto.de', 'emailxfer.com',
  'fastmail.fm', 'filzmail.com', 'get1mail.com', 'getonemail.com',
  'harakirimail.com', 'inbox.si', 'jetable.org', 'kurzepost.de',
  'link2mail.net', 'mail-temporaire.fr', 'mail4trash.com', 'mailcatch.com',
  'maileater.com', 'mailexpire.com', 'mailforspam.com', 'mailmetrash.com',
  'mailmoat.com', 'mailnull.com', 'mailzilla.org', 'mintemail.com',
  'nowmymail.com', 'pookmail.com', 'proxymail.eu', 'rcpt.at',
  'receivemail.org', 'recursor.net', 'rmqkr.net', 'safetymail.info',
  'shortmail.net', 'spamavert.com', 'spambox.us', 'spamfree24.org',
  'spamgourmet.com', 'spamhole.com', 'spamify.com', 'spammotel.com',
  'spamspot.com', 'spamthis.co.uk', 'spamtroll.net', 'supermailer.jp',
  'tempinbox.co.uk', 'tempomail.fr', 'temporarymail.net', 'thankyou2010.com',
  'trash-amil.com', 'trash2009.com', 'trashdevil.com', 'trashemail.de',
  'trashymail.com', 'tyldd.com', 'uggsrock.com', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'wh4f.org', 'whatpaas.com',
  'willhackforfood.biz', 'willselfdestruct.com', 'xagloo.com', 'xemaps.com',
  'xents.com', 'xmaily.com', 'xoxy.net', 'yuurok.com', 'zehnminutenmail.de',
  'zoemail.org'
]

// Enhanced email format validation
const validateEmailFormat = (email: string): boolean => {
  // More comprehensive regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(email)) return false
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /^test[0-9]*@/i,
    /^fake[0-9]*@/i,
    /^dummy[0-9]*@/i,
    /^temp[0-9]*@/i,
    /^spam[0-9]*@/i,
    /^noreply@/i,
    /^no-reply@/i,
    /^donotreply@/i,
    /^admin@/i,
    /^webmaster@/i,
    /@example\./i,
    /@test\./i,
    /@localhost/i
  ]
  
  return !suspiciousPatterns.some(pattern => pattern.test(email))
}

// Check if domain has MX record (simplified DNS check)
const checkMXRecord = async (domain: string): Promise<boolean> => {
  try {
    // Use a public DNS resolver to check MX records
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`)
    const data = await response.json()
    return data.Status === 0 && data.Answer && data.Answer.length > 0
  } catch {
    // If DNS check fails, allow the email (fallback)
    return true
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()

    // Length validation
    if (trimmedEmail.length === 0) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (trimmedEmail.length > 320) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Enhanced format validation
    if (!validateEmailFormat(trimmedEmail)) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const domain = trimmedEmail.split('@')[1]
    if (!domain) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Check for disposable/temporary email domains
    if (disposableDomains.includes(domain)) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Check MX record for domain validity
    const hasMXRecord = await checkMXRecord(domain)
    if (!hasMXRecord) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Additional checks for common typos in popular domains
    const commonDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co', 'gmaill.com'],
      'yahoo.com': ['yaho.com', 'yahoo.co', 'yahooo.com'],
      'hotmail.com': ['hotmai.com', 'hotmial.com', 'hotmail.co'],
      'outlook.com': ['outlok.com', 'outlook.co']
    }

    for (const [correct, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        return new Response(
          JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
    }

    console.log(`Email validation successful for: ${trimmedEmail}`)
    return new Response(
      JSON.stringify({ valid: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error('Email validation error:', error)
    return new Response(
      JSON.stringify({ valid: false, error: "Please enter a valid email address to see your results" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
