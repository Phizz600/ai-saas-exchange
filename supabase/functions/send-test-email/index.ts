
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log available environment variables (without revealing their values)
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Environment check:", {
      hasResendKey: !!apiKey,
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      supabaseUrl: Deno.env.get("SUPABASE_URL"), // Safe to log URL
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 3) : "N/A",
      apiKeySuffix: apiKey ? apiKey.substring(apiKey.length - 3) : "N/A"
    });

    // Log request body for debugging
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    // Initialize Supabase admin client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Supabase client initialized");
    
    // First check for users in auth.users
    console.log("Attempting to fetch most recent user from auth.users...");
    const { data: authUsers, error: authUserError } = await supabase
      .from('auth')
      .select('users(id, email, created_at)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let userEmail;
    let firstName = "User";
    let userType = "ai_investor";

    if (authUserError || !authUsers) {
      console.log("Could not fetch from auth.users, trying profiles table");
      
      // Get the most recent user from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, user_type')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (profilesError || !profiles || profiles.length === 0) {
        console.error("Error fetching from profiles:", profilesError);
        throw new Error(`No users found in the system or unable to access user data`);
      }

      // Get the user email from auth.users using the profile ID
      const profile = profiles[0];
      const { data: userData, error: userError } = await supabase
        .auth.admin.getUserById(profile.id);
      
      if (userError || !userData || !userData.user || !userData.user.email) {
        console.error("Error fetching user email:", userError);
        throw new Error("Unable to retrieve user email");
      }
      
      userEmail = userData.user.email;
      firstName = profile.first_name || "User";
      userType = profile.user_type || "ai_investor";
    } else {
      // Use data from auth.users
      const user = authUsers.users;
      userEmail = user.email;
    }

    if (!userEmail) {
      throw new Error("Unable to find any users with email addresses");
    }

    console.log(`Sending test email to user: ${userEmail}`);

    // Check if Resend API key is available
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    // Initialize Resend with the API key
    const resend = new Resend(apiKey);
    
    // Send the welcome email
    const emailResponse = await resend.emails.send({
      from: "AI Exchange Club <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Welcome to AI Exchange Club, ${firstName}!`,
      html: `
        <div style="font-family: 'Exo 2', sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6; font-family: 'Exo 2', sans-serif; font-weight: 700;">Welcome to AI Exchange Club!</h1>
          <p>Hi ${firstName},</p>
          <p>We're excited to have you join our community${userType === 'ai_builder' ? ' of AI builders' : ' of AI investors'}!</p>
          
          ${userType === 'ai_builder' ? `
            <h2 style="color: #0EA4E9; font-family: 'Exo 2', sans-serif; font-weight: 600;">Getting Started as an AI Builder</h2>
            <p>Here's what you can do now:</p>
            <ul>
              <li>List your AI business or product</li>
              <li>Connect with potential investors</li>
              <li>Track your product's performance</li>
            </ul>
          ` : `
            <h2 style="color: #0EA4E9; font-family: 'Exo 2', sans-serif; font-weight: 600;">Getting Started as an AI Investor</h2>
            <p>Here's what you can do now:</p>
            <ul>
              <li>Browse AI businesses and products</li>
              <li>Connect with AI builders</li>
              <li>Track your investment opportunities</li>
            </ul>
          `}
          
          <p>Visit our <a href="https://aiexchange.club" style="color: #D946EE;">marketplace</a> to get started!</p>
          
          <p>Best regards,<br>The AI Exchange Club Team</p>
        </div>
      `,
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      message: "Test email sent successfully",
      to: userEmail,
      firstName,
      userType,
      response: emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-test-email function:", error);
    console.error("Error details:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        context: "Error occurred in send-test-email Edge Function"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
