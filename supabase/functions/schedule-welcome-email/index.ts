
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  firstName: string;
  email: string;
  userType: 'ai_builder' | 'ai_investor';
  timestamp?: string;
  source?: string;
  siteUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to schedule welcome email");
    
    const requestData = await req.json();
    console.log("Request data received:", JSON.stringify(requestData, null, 2));

    // Extract and validate email data
    const { firstName, email, userType, timestamp, source, siteUrl }: WelcomeEmailRequest = requestData;
    
    if (!email) {
      console.error("Missing email in request");
      return new Response(
        JSON.stringify({
          error: "Email is required",
          details: "The email field is missing from the request"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    if (!firstName) {
      console.log("First name not provided, using default");
    }
    
    if (!userType) {
      console.log("User type not provided, using default");
    }

    console.log(`Scheduling welcome email to ${email} (${userType || "unknown type"})`);
    console.log(`Request metadata - timestamp: ${timestamp || "none"}, source: ${source || "none"}`);
    if (siteUrl) {
      console.log(`Using provided site URL: ${siteUrl}`);
    }

    // Set up delayed execution of the welcome email (simulates a background task)
    const scheduleId = crypto.randomUUID();
    
    console.log(`Creating delayed task with ID: ${scheduleId}`);
    
    // This uses Deno's timer to send the email after a delay
    // In production this would use a proper task queue system
    setTimeout(async () => {
      try {
        console.log(`Executing delayed welcome email task ${scheduleId} for ${email}`);
        
        // Make request to send-welcome-email function
        const BASE_URL = Deno.env.get("SUPABASE_URL") || "";
        const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
        const functionUrl = `${BASE_URL}/functions/v1/send-welcome-email`;
        
        console.log(`Calling endpoint: ${functionUrl}`);
        
        const response = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ANON_KEY}`
          },
          body: JSON.stringify({
            email,
            firstName,
            userType,
            timestamp: new Date().toISOString(),
            source: "scheduled_task",
            siteUrl: siteUrl || null
          })
        });
        
        const result = await response.json();
        console.log(`Delayed welcome email task ${scheduleId} completed with status: ${response.status}`);
        console.log(`Response: ${JSON.stringify(result)}`);
        
        if (!response.ok) {
          console.error(`Error in delayed email task ${scheduleId}:`, result);
        }
      } catch (error) {
        console.error(`Exception in delayed email task ${scheduleId}:`, error);
      }
    }, 120000); // 120,000 ms = 2 minutes
    
    console.log(`Welcome email scheduled with ID: ${scheduleId}, will be sent in 2 minutes`);

    return new Response(
      JSON.stringify({ 
        message: "Welcome email scheduled successfully", 
        scheduleId,
        scheduledAt: new Date().toISOString(),
        willExecuteAt: new Date(Date.now() + 120000).toISOString()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in schedule-welcome-email function:", error);
    console.error("Error details:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        stack: error.stack,
        context: "Error occurred in schedule-welcome-email Edge Function"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
