
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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
    // Initialize Supabase admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the most recent user from auth.users
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (userError) {
      console.error("Error fetching most recent user:", userError);
      throw new Error("Failed to fetch most recent user");
    }

    if (!users || users.length === 0) {
      throw new Error("No users found in the system");
    }

    const user = users[0];
    const email = user.email;
    const firstName = user.raw_user_meta_data?.first_name || "User";
    const userType = user.raw_user_meta_data?.user_type || "ai_investor";

    console.log(`Sending test email to most recent user: ${email}`);

    // Send the welcome email
    const emailResponse = await resend.emails.send({
      from: "AI Exchange Club <onboarding@resend.dev>",
      to: [email],
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
      to: email,
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
