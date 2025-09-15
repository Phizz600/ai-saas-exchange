import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface UpdateProfileRequest {
  fullName: string;
  email: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  emailChanged?: boolean;
  requiresVerification?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow PATCH requests
  if (req.method !== "PATCH") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create a client with the user's session
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the user's session
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse request body
    const { fullName, email }: UpdateProfileRequest = await req.json();

    // Input validation
    const validationErrors: string[] = [];

    if (!fullName || typeof fullName !== 'string') {
      validationErrors.push("Full name is required");
    } else if (fullName.length > 50) {
      validationErrors.push("Full name must be 50 characters or less");
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(fullName.trim())) {
      validationErrors.push("Full name can only contain letters, spaces, hyphens, apostrophes, and periods");
    }

    if (!email || typeof email !== 'string') {
      validationErrors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push("Please enter a valid email address");
    }

    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: validationErrors.join(", ") }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Sanitize inputs
    const sanitizedFullName = fullName.trim().replace(/<[^>]*>/g, '');
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if email is being changed
    const emailChanged = user.email !== sanitizedEmail;
    let requiresVerification = false;

    // Update profile in database
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: sanitizedFullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Handle email change if needed
    if (emailChanged) {
      try {
        // Check if email is already in use by another user
        const { data: existingUser, error: checkError } = await supabase
          .from("auth.users")
          .select("id")
          .eq("email", sanitizedEmail)
          .neq("id", user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Error checking email availability:", checkError);
          return new Response(
            JSON.stringify({ error: "Failed to verify email availability" }),
            { 
              status: 500, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }

        if (existingUser) {
          return new Response(
            JSON.stringify({ error: "Email address is already in use" }),
            { 
              status: 409, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }

        // Update email in auth.users table
        const { error: emailUpdateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { email: sanitizedEmail }
        );

        if (emailUpdateError) {
          console.error("Error updating email:", emailUpdateError);
          return new Response(
            JSON.stringify({ error: "Failed to update email address" }),
            { 
              status: 500, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }

        // Send verification email for the new address
        const { error: verificationError } = await supabase.auth.admin.generateLink({
          type: 'signup',
          email: sanitizedEmail,
          options: {
            redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:3000"}/auth?verified=true`
          }
        });

        if (verificationError) {
          console.error("Error sending verification email:", verificationError);
          // Don't fail the request, just log the error
        } else {
          requiresVerification = true;
        }

      } catch (error) {
        console.error("Error handling email change:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update email address" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Log the profile update event (optional audit trail)
    try {
      await supabase
        .from("user_activity_log")
        .insert({
          user_id: user.id,
          action: "profile_updated",
          details: {
            fields_updated: emailChanged ? ["full_name", "email"] : ["full_name"],
            email_changed: emailChanged,
            timestamp: new Date().toISOString()
          }
        });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error("Error logging profile update:", logError);
    }

    const response: UpdateProfileResponse = {
      success: true,
      message: emailChanged 
        ? "Profile updated successfully. Please check your email to verify the new address."
        : "Profile updated successfully.",
      emailChanged,
      requiresVerification
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Unexpected error in update-user-profile:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

