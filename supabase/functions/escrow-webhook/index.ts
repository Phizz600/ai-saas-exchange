
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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const escrowWebhookSecret = Deno.env.get("ESCROW_WEBHOOK_SECRET");
    
    // Create Supabase client with admin privileges for webhook processing
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing service role key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify webhook signature if secret is set
    if (escrowWebhookSecret) {
      const signature = req.headers.get("escrow-signature");
      if (!signature) {
        console.error("Missing escrow-signature header");
        return new Response(
          JSON.stringify({ error: "Invalid webhook signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // TODO: Implement proper signature verification when Escrow.com provides documentation
    }
    
    // Parse webhook data
    const webhookData = await req.json();
    console.log("Received webhook data:", webhookData);
    
    if (!webhookData.transaction_id || !webhookData.event) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook data format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Find our internal escrow transaction that matches the Escrow.com ID
    const { data: transaction, error: txError } = await supabase
      .from("escrow_transactions")
      .select("id, status, conversation_id, product_id, buyer_id, seller_id")
      .eq("escrow_api_id", webhookData.transaction_id)
      .single();
      
    if (txError) {
      console.error("Error finding transaction:", txError);
      return new Response(
        JSON.stringify({ error: "Transaction not found", details: txError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Map Escrow.com status to our status
    let newStatus = transaction.status;
    let statusMessage = "";
    
    switch (webhookData.event) {
      case "transaction.created":
        newStatus = "escrow_created";
        statusMessage = "Escrow transaction has been created.";
        break;
      case "transaction.payment_received":
        newStatus = "payment_secured";
        statusMessage = "Payment has been received and secured in escrow.";
        break;
      case "transaction.in_broker":
        newStatus = "payment_secured";
        statusMessage = "Funds are secured in escrow.";
        break;
      case "transaction.in_dispute":
        newStatus = "disputed";
        statusMessage = "Transaction is now under dispute.";
        break;
      case "transaction.cancelled":
        newStatus = "cancelled";
        statusMessage = "Transaction has been cancelled.";
        break;
      case "transaction.closed":
        newStatus = "completed";
        statusMessage = "Transaction has been completed and funds released.";
        break;
      default:
        console.log(`Unhandled event type: ${webhookData.event}`);
        // Don't update status for unhandled events
        break;
    }
    
    // Only update if the status changed
    if (newStatus !== transaction.status) {
      console.log(`Updating transaction ${transaction.id} status from ${transaction.status} to ${newStatus}`);
      
      // Update the transaction status
      const { error: updateError } = await supabase
        .from("escrow_transactions")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", transaction.id);
        
      if (updateError) {
        console.error("Error updating transaction:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update transaction", details: updateError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Add a system message to the conversation
      if (transaction.conversation_id) {
        await supabase
          .from("messages")
          .insert({
            conversation_id: transaction.conversation_id,
            sender_id: "system",
            content: `🔄 **Escrow Status Update** (via webhook)\n\nStatus: ${newStatus.replace(/_/g, " ").toUpperCase()}\n\n${statusMessage}`
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
        await handleFundsReleased(supabase, transaction.id, transaction.conversation_id);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        transaction_id: transaction.id,
        status_updated: newStatus !== transaction.status,
        new_status: newStatus
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in escrow-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to handle funds release notifications
async function handleFundsReleased(supabase: any, transactionId: string, conversationId: string) {
  try {
    // Get the transaction details
    const { data: transaction } = await supabase
      .from("escrow_transactions")
      .select(`
        *,
        product:product_id (title)
      `)
      .eq("id", transactionId)
      .single();
    
    if (!transaction) {
      console.error("Transaction not found for funds release notification");
      return;
    }
    
    // Add a celebration message to the conversation
    await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: "system",
        content: `💰 **FUNDS RELEASED**\n\nThe funds for this transaction ($${transaction.amount.toFixed(2)}) have been released to the seller. Thank you for using our escrow service!\n\nTransaction ID: ${transactionId.substring(0, 8)}\nProduct: ${transaction.product.title}`
      });
    
    // Create notifications for both parties
    await supabase.from("notifications").insert([
      {
        user_id: transaction.seller_id,
        title: "Funds Released!",
        message: `Payment of $${transaction.amount.toFixed(2)} has been released to your account for the sale of ${transaction.product.title}`,
        type: "escrow_completed",
        related_product_id: transaction.product_id
      },
      {
        user_id: transaction.buyer_id,
        title: "Transaction Completed",
        message: `Your payment of $${transaction.amount.toFixed(2)} for ${transaction.product.title} has been released to the seller. Transaction complete!`,
        type: "escrow_completed",
        related_product_id: transaction.product_id
      }
    ]);
    
    console.log("Funds release notifications sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending funds release notifications:", error);
    return false;
  }
}
