
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EscrowRequest {
  action: "create" | "update" | "get" | "status" | "dispute" | "verify_deposit" | "lifecycle_update";
  transactionId?: string;
  data?: any;
}

interface EscrowErrorResponse {
  error: string;
  details?: any;
  status?: number;
  fallback?: string;
  retry_recommended?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a context for structured logging
  const requestId = crypto.randomUUID();
  const logContext = {
    requestId,
    timestamp: new Date().toISOString(),
  };

  try {
    logRequest("Request received", logContext);
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const escrowApiKey = Deno.env.get("ESCROW_API_KEY");
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return errorResponse(401, "Missing Authorization header", logContext);
    }

    // Set the auth header for the Supabase client
    const supabaseClient = supabase.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: "",
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse(401, "Unauthorized user", logContext, { error: userError });
    }

    // Get the request body
    const { action, transactionId, data }: EscrowRequest = await req.json();
    
    logRequest(`Processing action: ${action}`, { ...logContext, action, userId: user.id });

    // Escrow.com API base URL
    const escrowApiUrl = "https://api.escrow.com/2017-09-01";

    // Handle different actions
    let response;
    let apiUrl;
    let method: string;
    let apiData: any = null;
    let retryCount = 0;
    const maxRetries = 2;

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
            logRequest("Retrieved seller email", { ...logContext, email: data.seller_email });
          } else {
            logRequest("Could not retrieve seller email", { ...logContext, error: userError });
            // Use a placeholder email if needed
            data.seller_email = "seller@placeholder.com";
          }
        } catch (error) {
          logRequest("Error retrieving seller email", { ...logContext, error });
          data.seller_email = "seller@placeholder.com";
        }
      } else {
        logRequest("SUPABASE_SERVICE_ROLE_KEY not available", logContext);
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
          // Add webhook registration if in production environment
          webhook_uri: Deno.env.get("ESCROW_WEBHOOK_URL"),
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
          return errorResponse(404, "Escrow transaction not found", logContext, { error: escrowError });
        }
        
        // For now, we're checking status from Escrow.com API
        apiUrl = `${escrowApiUrl}/transaction/${escrowTransaction.escrow_api_id}/status`;
        method = "GET";
        break;
        
      case "lifecycle_update":
        // This is a special action to update the transaction status based on its current state
        // Useful for manually moving transactions along the lifecycle
        if (!data.transaction_id || !data.new_status) {
          return errorResponse(400, "Missing transaction_id or new_status", logContext);
        }
        
        try {
          const { data: transaction, error: txError } = await supabase
            .from("escrow_transactions")
            .select("*")
            .eq("id", data.transaction_id)
            .single();
            
          if (txError || !transaction) {
            return errorResponse(404, "Transaction not found", logContext, { error: txError });
          }
          
          // Update the transaction status
          const { error: updateError } = await supabase
            .from("escrow_transactions")
            .update({
              status: data.new_status,
              updated_at: new Date().toISOString()
            })
            .eq("id", data.transaction_id);
            
          if (updateError) {
            return errorResponse(500, "Failed to update transaction", logContext, { error: updateError });
          }
          
          // Add a status update message to the conversation
          if (transaction.conversation_id) {
            await supabase
              .from("messages")
              .insert({
                conversation_id: transaction.conversation_id,
                sender_id: "system",
                content: `🔄 **Escrow Status Update** (manual)\n\nStatus changed from "${transaction.status.replace(/_/g, " ").toUpperCase()}" to "${data.new_status.replace(/_/g, " ").toUpperCase()}"\n\n${data.message || "The transaction has been updated to the next stage."}`
              });
          }
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              transaction_id: data.transaction_id,
              previous_status: transaction.status,
              new_status: data.new_status
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          return errorResponse(500, "Error updating transaction lifecycle", logContext, { error });
        }

      default:
        return errorResponse(400, "Invalid action", logContext);
    }

    logRequest(`Making ${method} request to Escrow.com API: ${apiUrl}`, { ...logContext, apiData });
    
    // Make fallback response in case no API key
    if (!escrowApiKey) {
      logRequest("No ESCROW_API_KEY provided", logContext);
      
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
          logRequest("Database error during fallback", { ...logContext, error: dbError });
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
    
    // Implement retry logic for API calls with exponential backoff
    const executeApiCall = async (retryAttempt = 0): Promise<Response> => {
      try {
        const backoffTime = retryAttempt === 0 ? 0 : Math.min(1000 * Math.pow(2, retryAttempt), 10000);
        if (retryAttempt > 0) {
          logRequest(`Retry attempt ${retryAttempt} after ${backoffTime}ms backoff`, { ...logContext, retryAttempt });
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
        
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
          logRequest(`Escrow.com API Error (${escrowResponse.status})`, { 
            ...logContext, 
            status: escrowResponse.status, 
            error: errorBody,
            retryAttempt 
          });
          
          // Determine if we should retry based on error code
          const shouldRetry = (
            retryAttempt < maxRetries && 
            (escrowResponse.status >= 500 || escrowResponse.status === 429)
          );
          
          if (shouldRetry) {
            return executeApiCall(retryAttempt + 1);
          }
          
          return new Response(
            JSON.stringify({ 
              error: "Escrow.com API error", 
              status: escrowResponse.status,
              details: errorBody,
              retry_attempted: retryAttempt > 0,
              max_retries_reached: retryAttempt >= maxRetries
            }),
            { 
              status: 502, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
        
        const escrowData = await escrowResponse.json();
        logRequest("Escrow.com API Response", { ...logContext, response: escrowData });
        
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
            logRequest("Database update error", { ...logContext, error: dbError });
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
          
          // Add a message to the conversation if this is not a deposit
          if (!data.description?.toLowerCase().includes('deposit') && data.conversation_id) {
            await supabase
              .from("messages")
              .insert({
                conversation_id: data.conversation_id,
                sender_id: "system",
                content: `🔐 **Escrow Transaction Created**\n\nAn escrow transaction has been set up for $${data.amount}.\n\nDescription: ${data.description}\nTimeline: ${data.timeline || '30 days'}`
              });
          }
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
        logRequest("Error calling Escrow.com API", { ...logContext, error: apiError, retryAttempt });
        
        // Determine if we should retry
        const shouldRetry = retryAttempt < maxRetries;
        
        if (shouldRetry) {
          return executeApiCall(retryAttempt + 1);
        }
        
        // If we encounter a network error or API failure after all retries, 
        // still update the transaction to a manual state if this was a create action
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
            logRequest("Database error during fallback", { ...logContext, error: dbError });
          }
        }
        
        return new Response(
          JSON.stringify({ 
            error: "Failed to connect to Escrow.com API after multiple retries",
            details: apiError.message,
            fallback: action === "create" ? "manual_setup" : null,
            retry_attempts: retryAttempt
          }),
          { 
            status: 503, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    };
    
    // Execute the API call with retry logic
    return await executeApiCall();
    
  } catch (error: any) {
    return errorResponse(500, "Error in escrow-api function", logContext, { error });
  }
});

// Helper function for error responses
function errorResponse(
  status: number, 
  message: string, 
  logContext: any, 
  details?: any
): Response {
  logRequest(`Error: ${message}`, { ...logContext, status, ...details });
  
  return new Response(
    JSON.stringify({ 
      error: message,
      details: details?.error?.message || details,
    }),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json"
      } 
    }
  );
}

// Helper function for structured logging
function logRequest(message: string, context: any): void {
  console.log(JSON.stringify({
    message,
    ...context,
    service: "escrow-api"
  }));
}
