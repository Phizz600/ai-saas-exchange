
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const escrowApiKey = Deno.env.get("ESCROW_API_KEY");
    
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing service role key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create admin client with service role (this has higher privileges)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get pending transactions that have escrow_api_id
    const { data: transactions, error: txError } = await supabase
      .from("escrow_transactions")
      .select("*")
      .not("escrow_api_id", "is", null)
      .in("status", ["escrow_created", "payment_secured", "delivery_in_progress", "inspection_period"])
      .order("updated_at", { ascending: true });
      
    if (txError) {
      return new Response(
        JSON.stringify({ error: "Error fetching transactions", details: txError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${transactions.length} active transactions to check status`);
    
    if (!escrowApiKey || transactions.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: !escrowApiKey ? "No Escrow API key provided" : "No transactions to check",
          transactions_count: transactions.length
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check status of each transaction
    const results = [];
    
    for (const transaction of transactions) {
      try {
        console.log(`Checking status for transaction: ${transaction.id} (Escrow ID: ${transaction.escrow_api_id})`);
        
        // Call Escrow.com API to get status
        const escrowApiUrl = `https://api.escrow.com/2017-09-01/transaction/${transaction.escrow_api_id}/status`;
        const escrowResponse = await fetch(escrowApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(escrowApiKey + ":")}`,
          },
        });
        
        if (!escrowResponse.ok) {
          console.error(`Error getting status for transaction ${transaction.escrow_api_id}: ${escrowResponse.status}`);
          results.push({
            id: transaction.id,
            error: `API error: ${escrowResponse.status}`,
            status_checked: false
          });
          continue;
        }
        
        const escrowData = await escrowResponse.json();
        console.log(`Escrow status for ${transaction.escrow_api_id}: ${escrowData.status}`);
        
        // Map Escrow.com status to our status
        let newStatus = transaction.status;
        let statusMessage = "";
        let statusChanged = false;
        
        // Mapping logic based on Escrow.com status
        if (escrowData.status) {
          const escrowStatus = escrowData.status.toLowerCase();
          
          if (escrowStatus === "in broker" && transaction.status === "escrow_created") {
            newStatus = "payment_secured";
            statusMessage = "Payment has been received and secured in escrow.";
            statusChanged = true;
          } else if (escrowStatus === "closed" && transaction.status !== "completed") {
            newStatus = "completed";
            statusMessage = "Transaction has been completed and funds released.";
            statusChanged = true;
          } else if (escrowStatus === "cancelled" && transaction.status !== "cancelled") {
            newStatus = "cancelled";
            statusMessage = "Transaction has been cancelled.";
            statusChanged = true;
          } else if (escrowStatus === "in dispute" && transaction.status !== "disputed") {
            newStatus = "disputed";
            statusMessage = "Transaction is now under dispute.";
            statusChanged = true;
          }
        }
        
        // Update if status changed
        if (statusChanged) {
          console.log(`Updating transaction ${transaction.id} status from ${transaction.status} to ${newStatus}`);
          
          // Update the transaction status
          await supabase
            .from("escrow_transactions")
            .update({
              status: newStatus,
              updated_at: new Date().toISOString()
            })
            .eq("id", transaction.id);
            
          // Add a system message to the conversation
          if (transaction.conversation_id) {
            await supabase
              .from("messages")
              .insert({
                conversation_id: transaction.conversation_id,
                sender_id: "system",
                content: `🔄 **Escrow Status Update** (automated check)\n\nStatus: ${newStatus.replace(/_/g, " ").toUpperCase()}\n\n${statusMessage}`
              });
          }
          
          // Create notifications for both parties
          const notifications = [
            {
              user_id: transaction.buyer_id,
              title: "Escrow Status Updated",
              message: statusMessage,
              type: "escrow_update",
              related_product_id: transaction.product_id
            },
            {
              user_id: transaction.seller_id,
              title: "Escrow Status Updated",
              message: statusMessage,
              type: "escrow_update",
              related_product_id: transaction.product_id
            }
          ];
          
          await supabase
            .from("notifications")
            .insert(notifications);
            
          // Special case: If transaction is completed, handle the funds release notification
          if (newStatus === "completed") {
            // Get product information for the notification
            const { data: product } = await supabase
              .from("products")
              .select("title")
              .eq("id", transaction.product_id)
              .single();
              
            // Add a celebration message to the conversation
            await supabase
              .from("messages")
              .insert({
                conversation_id: transaction.conversation_id,
                sender_id: "system",
                content: `💰 **FUNDS RELEASED**\n\nThe funds for this transaction ($${transaction.amount.toFixed(2)}) have been released to the seller. Thank you for using our escrow service!\n\nTransaction ID: ${transaction.id.substring(0, 8)}\nProduct: ${product?.title || "Product"}`
              });
          }
        }
        
        results.push({
          id: transaction.id,
          escrow_id: transaction.escrow_api_id,
          previous_status: transaction.status,
          current_status: newStatus,
          escrow_status: escrowData.status,
          status_changed: statusChanged
        });
        
      } catch (error) {
        console.error(`Error checking transaction ${transaction.id}:`, error);
        results.push({
          id: transaction.id,
          error: error.message,
          status_checked: false
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        checked: transactions.length,
        updated: results.filter(r => r.status_changed).length,
        results
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: any) {
    console.error("Error in check-escrow-status function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
