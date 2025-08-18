
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ valid: false, error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid email format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ]
    
    const domain = email.split('@')[1]?.toLowerCase()
    const isDisposable = disposableDomains.includes(domain)

    if (isDisposable) {
      return new Response(
        JSON.stringify({ valid: false, error: "Please use a permanent email address" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Additional length check
    if (email.length > 320) {
      return new Response(
        JSON.stringify({ valid: false, error: "Email address is too long" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error('Email validation error:', error)
    return new Response(
      JSON.stringify({ valid: false, error: "Validation failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
