
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EscrowRequest {
  action: "create" | "update" | "get";
  transactionId?: string;
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const escrowApiKey = Deno.env.get("ESCROW_API_KEY");
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Set the auth header for the Supabase client
    const supabaseClient = supabase.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: "",
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized user" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the request body
    const { action, transactionId, data }: EscrowRequest = await req.json();

    // Escrow.com API base URL
    const escrowApiUrl = "https://api.escrow.com/2017-09-01";

    // Handle different actions
    let response;
    let apiUrl;
    let method: string;
    let apiData: any = null;

    switch (action) {
      case "create":
        apiUrl = `${escrowApiUrl}/transaction`;
        method = "POST";
        apiData = {
          currency: "usd",
          description: data.description,
          items: [
            {
              description: data.description,
              schedule: [
                {
                  payer: {
                    customer_id: data.buyer_id,
                  },
                  amount: data.amount,
                  beneficial_owner: {
                    customer_id: data.seller_id,
                  },
                },
              ],
            },
          ],
          parties: [
            {
              role: "buyer",
              customer: {
                customer_id: data.buyer_id,
                name: data.buyer_name,
                email: data.buyer_email,
              },
            },
            {
              role: "seller",
              customer: {
                customer_id: data.seller_id,
                name: data.seller_name,
                email: data.seller_email,
              },
            },
          ],
          type: "domain",
        };
        break;

      case "update":
        apiUrl = `${escrowApiUrl}/transaction/${transactionId}`;
        method = "PATCH";
        apiData = data;
        break;

      case "get":
        apiUrl = `${escrowApiUrl}/transaction/${transactionId}`;
        method = "GET";
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`Making ${method} request to Escrow.com API: ${apiUrl}`);
    
    // Make request to Escrow.com API
    const escrowResponse = await fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(escrowApiKey + ":")}`,
      },
      body: method !== "GET" ? JSON.stringify(apiData) : undefined,
    });

    const escrowData = await escrowResponse.json();
    
    // If transaction was created successfully, update the database
    if (action === "create" && escrowResponse.ok) {
      // Store the transaction ID and update the escrow status
      const { error: dbError } = await supabase
        .from("escrow_transactions")
        .update({
          escrow_api_id: escrowData.id,
          status: "escrow_created",
        })
        .eq("id", data.internal_transaction_id);

      if (dbError) {
        console.error("Database update error:", dbError);
      }
    }

    return new Response(
      JSON.stringify(escrowData),
      { status: escrowResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in escrow-api function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
