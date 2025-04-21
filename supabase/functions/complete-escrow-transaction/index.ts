
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const client = createClient(supabaseUrl, anonKey);

    // Read auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing Authorization" }),
        { status: 401, headers: corsHeaders }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await client.auth.getUser(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid user" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Parse body
    const { escrowTransactionId } = await req.json();
    if (!escrowTransactionId) {
      return new Response(
        JSON.stringify({ error: "escrowTransactionId required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get the escrow transaction & check buyer
    const { data: transaction, error: txError } = await client
      .from("escrow_transactions")
      .select("id, buyer_id, seller_id, product_id, conversation_id, status, amount")
      .eq("id", escrowTransactionId)
      .single();

    if (!transaction || txError) {
      return new Response(
        JSON.stringify({ error: "Escrow transaction not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (transaction.buyer_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Only the buyer may complete this transaction" }),
        { status: 403, headers: corsHeaders }
      );
    }

    if (transaction.status === "completed") {
      return new Response(
        JSON.stringify({ error: "Transaction already completed" }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Move status to completed
    const { error: updateErr } = await client
      .from("escrow_transactions")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", escrowTransactionId);

    if (updateErr) {
      return new Response(
        JSON.stringify({ error: "Failed to mark as complete" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Add system message to conversation if possible
    if (transaction.conversation_id) {
      await client.from("messages").insert({
        conversation_id: transaction.conversation_id,
        sender_id: "system",
        content: `✅ **Escrow Completed**\n\nThe buyer has verified the product and released payment. The transaction is now complete.`
      });
    }

    // Notify both buyer and seller (escrow_completed)
    await client.from("notifications").insert([
      {
        user_id: transaction.seller_id,
        title: "Funds Released!",
        message: `The buyer has completed the transaction. Funds for $${transaction.amount} have been released to your account.`,
        type: "escrow_completed",
        related_product_id: transaction.product_id
      },
      {
        user_id: transaction.buyer_id,
        title: "Transaction Complete",
        message: `You have marked this transaction as complete. The seller will receive payment for $${transaction.amount}.`,
        type: "escrow_completed",
        related_product_id: transaction.product_id
      }
    ]);

    // Success!
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in complete-escrow-transaction:", error);
    return new Response(
      JSON.stringify({ error: error?.toString() }),
      { status: 500, headers: corsHeaders }
    );
  }
});
