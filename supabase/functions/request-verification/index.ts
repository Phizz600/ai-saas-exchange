
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No authorization token' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle different verification types
    switch (type) {
      case 'email':
        // Send verification email
        const { error: emailError } = await supabaseClient.auth.admin.generateLink({
          type: 'email_change',
          email: user.email!,
        });
        
        if (emailError) throw emailError;
        break;

      case 'phone':
        // Here you would integrate with a phone verification service
        // For now, we'll just update the status
        await supabaseClient
          .from('user_verifications')
          .update({ status: 'pending', verification_data: { started_at: new Date() } })
          .eq('user_id', user.id)
          .eq('verification_type', 'phone');
        break;

      case 'identity':
        // Here you would integrate with an identity verification service
        // For now, we'll just update the status
        await supabaseClient
          .from('user_verifications')
          .update({ status: 'pending', verification_data: { started_at: new Date() } })
          .eq('user_id', user.id)
          .eq('verification_type', 'identity');
        break;

      default:
        throw new Error(`Invalid verification type: ${type}`);
    }

    return new Response(
      JSON.stringify({ message: 'Verification request processed' }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing verification request:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
