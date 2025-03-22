
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EscrowRequest {
  action: "create" | "update" | "get" | "status" | "dispute" | "verify_deposit";
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

    // If seller_email is empty and we have a seller_id, try to get the email using service role
    if (data && data.seller_email === "" && data.seller_id) {
      // Create admin client with service role (this has higher privileges)
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        try {
          // Try to get the seller's email directly from auth.users
          const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
            data.seller_id
          );
          
          if (!userError && userData && userData.user && userData.user.email) {
            data.seller_email = userData.user.email;
            console.log("Retrieved seller email:", data.seller_email);
          } else {
            console.error("Could not retrieve seller email:", userError);
            // Use a placeholder email if needed
            data.seller_email = "seller@placeholder.com";
          }
        } catch (error) {
          console.error("Error retrieving seller email:", error);
          data.seller_email = "seller@placeholder.com";
        }
      } else {
        console.warn("SUPABASE_SERVICE_ROLE_KEY not available");
        data.seller_email = "seller@placeholder.com";
      }
    }

    // Proceed with escrow API call setup
    switch (action) {
      case "create":
        apiUrl = `${escrowApiUrl}/transaction`;
        method = "POST";
        
        // Determine if this is a deposit transaction
        const isDeposit = data.isDeposit || data.description?.toLowerCase().includes('deposit');
        
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
                  timeline: data.timeline || "30 days",
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
          fee_structure: {
            platform_fee: data.platform_fee,
            escrow_fee: data.escrow_fee || "auto",
          },
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
        
      case "status":
        apiUrl = `${escrowApiUrl}/transaction/${transactionId}/status`;
        method = "GET";
        break;
        
      case "dispute":
        apiUrl = `${escrowApiUrl}/transaction/${transactionId}/dispute`;
        method = "POST";
        apiData = {
          reason: data.reason,
          description: data.description,
          initiated_by: data.user_id,
        };
        break;
        
      case "verify_deposit":
        // Check if the deposit has been made for an offer
        const { data: escrowTransaction, error: escrowError } = await supabase
          .from('escrow_transactions')
          .select('*')
          .eq('id', data.escrow_transaction_id)
          .single();
        
        if (escrowError || !escrowTransaction) {
          return new Response(
            JSON.stringify({ error: "Escrow transaction not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // For now, we're checking status from Escrow.com API
        apiUrl = `${escrowApiUrl}/transaction/${escrowTransaction.escrow_api_id}/status`;
        method = "GET";
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`Making ${method} request to Escrow.com API: ${apiUrl}`);
    console.log("Request data:", apiData);
    
    // Make fallback response in case no API key
    if (!escrowApiKey) {
      console.error("No ESCROW_API_KEY provided");
      
      // For create action, still update the transaction to manual mode
      if (action === "create" && data.internal_transaction_id) {
        try {
          await supabase
            .from("escrow_transactions")
            .update({
              status: "manual_setup",
            })
            .eq("id", data.internal_transaction_id);
            
          // Create a notification for both parties about the manual option
          await Promise.all([
            supabase.from("notifications").insert({
              user_id: data.buyer_id,
              title: "Manual Escrow Setup Required",
              message: "We couldn't connect to the Escrow service. Please proceed with the manual option.",
              type: "escrow_update",
              related_product_id: data.product_id,
            }),
            supabase.from("notifications").insert({
              user_id: data.seller_id,
              title: "Manual Escrow Setup Required",
              message: "We couldn't connect to the Escrow service. Please proceed with the manual option.",
              type: "escrow_update",
              related_product_id: data.product_id,
            }),
          ]);
        } catch (dbError) {
          console.error("Database error during fallback:", dbError);
        }
      }
      
      // Return a mock response to allow the process to continue
      return new Response(
        JSON.stringify({ 
          id: "manual-" + crypto.randomUUID().substring(0, 8),
          status: "manual_setup",
          message: "No Escrow API key provided. Proceeding with manual setup."
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Make request to Escrow.com API with error handling
    try {
      const escrowResponse = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(escrowApiKey + ":")}`,
        },
        body: method !== "GET" ? JSON.stringify(apiData) : undefined,
      });

      // Handle non-200 responses explicitly
      if (!escrowResponse.ok) {
        const errorBody = await escrowResponse.text();
        console.error(`Escrow.com API Error (${escrowResponse.status}):`, errorBody);
        return new Response(
          JSON.stringify({ 
            error: "Escrow.com API error", 
            status: escrowResponse.status,
            details: errorBody
          }),
          { 
            status: 502, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const escrowData = await escrowResponse.json();
      console.log("Escrow.com API Response:", escrowData);
      
      // Handle specific actions after API response
      if (action === "create" && escrowResponse.ok) {
        // Store the transaction ID and update the escrow status
        const { error: dbError } = await supabase
          .from("escrow_transactions")
          .update({
            escrow_api_id: escrowData.id,
            status: data.description?.toLowerCase().includes('deposit') ? 'deposit_pending' : 'escrow_created',
          })
          .eq("id", data.internal_transaction_id);

        if (dbError) {
          console.error("Database update error:", dbError);
        }
        
        // Create a notification for both parties
        await Promise.all([
          supabase.from("notifications").insert({
            user_id: data.buyer_id,
            title: data.description?.toLowerCase().includes('deposit') ? "Deposit Transaction Created" : "Escrow Transaction Created",
            message: data.description?.toLowerCase().includes('deposit') 
              ? `A deposit transaction for $${data.amount} has been created.`
              : `An escrow transaction for $${data.amount} has been created.`,
            type: "escrow_update",
            related_product_id: data.product_id,
          }),
          supabase.from("notifications").insert({
            user_id: data.seller_id,
            title: data.description?.toLowerCase().includes('deposit') ? "Deposit Transaction Created" : "Escrow Transaction Created",
            message: data.description?.toLowerCase().includes('deposit')
              ? `A deposit transaction for $${data.amount} has been created.`
              : `An escrow transaction for $${data.amount} has been created.`,
            type: "escrow_update",
            related_product_id: data.product_id,
          }),
        ]);
      }
      else if (action === "verify_deposit" && escrowResponse.ok) {
        // Update the deposit status based on Escrow.com API response
        const depositPaid = escrowData.status?.toLowerCase() === 'in broker' || 
                           escrowData.status?.toLowerCase() === 'closed';
        
        if (depositPaid) {
          // Update the escrow transaction status
          await supabase
            .from("escrow_transactions")
            .update({
              status: 'deposit_paid'
            })
            .eq("id", data.escrow_transaction_id);
            
          // Find and update the offer associated with this deposit
          const { data: deposits, error: depositError } = await supabase
            .from("deposit_transactions")
            .select("offer_id")
            .eq("escrow_transaction_id", data.escrow_transaction_id);
            
          if (!depositError && deposits && deposits.length > 0) {
            // Update the offer status
            await supabase
              .from("offers")
              .update({
                deposit_status: 'deposit_paid',
                status: 'pending' // Now the offer is actually pending seller review
              })
              .eq("id", deposits[0].offer_id);
              
            // Find product and notify seller about the verified offer
            const { data: offer, error: offerError } = await supabase
              .from("offers")
              .select("product_id, amount, bidder_id, product:products(seller_id, title)")
              .eq("id", deposits[0].offer_id)
              .single();
              
            if (!offerError && offer) {
              // Notify seller about the verified offer
              await supabase.from("notifications").insert({
                user_id: offer.product.seller_id,
                title: "Verified Offer Received",
                message: `You received a verified offer of $${offer.amount} for ${offer.product.title}. The buyer has already made a deposit.`,
                type: "verified_offer",
                related_product_id: offer.product_id
              });
            }
          }
        }
        
        // Return the verification result
        return new Response(
          JSON.stringify({ 
            verified: depositPaid,
            escrow_status: escrowData.status,
            escrow_details: escrowData
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      return new Response(
        JSON.stringify(escrowData),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (apiError) {
      console.error("Error calling Escrow.com API:", apiError);
      
      // If we encounter a network error or API failure, still update the transaction
      // to a manual state if this was a create action
      if (action === "create") {
        try {
          await supabase
            .from("escrow_transactions")
            .update({
              status: "manual_setup",
            })
            .eq("id", data.internal_transaction_id);
            
          // Create a notification for both parties about the fallback
          await Promise.all([
            supabase.from("notifications").insert({
              user_id: data.buyer_id,
              title: "API Connection Issue",
              message: "Escrow.com API connection failed. Please use the manual option.",
              type: "escrow_update",
              related_product_id: data.product_id,
            }),
            supabase.from("notifications").insert({
              user_id: data.seller_id,
              title: "API Connection Issue",
              message: "Escrow.com API connection failed. Please use the manual option.",
              type: "escrow_update",
              related_product_id: data.product_id,
            }),
          ]);
        } catch (dbError) {
          console.error("Database error during fallback:", dbError);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to connect to Escrow.com API",
          details: apiError.message,
          fallback: action === "create" ? "manual_setup" : null
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error: any) {
    console.error("Error in escrow-api function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
