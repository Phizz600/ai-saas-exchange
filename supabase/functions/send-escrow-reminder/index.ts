
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
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the request body
    const { conversationId, transactionId, userRole, status, hoursRemaining } = await req.json();
    
    if (!conversationId || !transactionId || !userRole || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Construct appropriate reminder message based on role and status
    let reminderMessage = "";
    
    if (status === "agreement_reached" && userRole === "buyer") {
      reminderMessage = `⏰ **Reminder: Payment Due Soon**\n\nYour payment for this transaction is due within ${Math.floor(hoursRemaining)} hours. Please complete the payment to proceed with the transaction.`;
    } else if (status === "payment_secured" && userRole === "seller") {
      reminderMessage = `⏰ **Reminder: Delivery Due Soon**\n\nYou need to confirm delivery of this transaction within ${Math.floor(hoursRemaining)} hours. Please provide delivery details to proceed.`;
    } else if (status === "delivery_in_progress" && userRole === "buyer") {
      reminderMessage = `⏰ **Reminder: Confirmation Due Soon**\n\nPlease confirm receipt of your purchase within ${Math.floor(hoursRemaining)} hours.`;
    } else if (status === "inspection_period" && userRole === "buyer") {
      reminderMessage = `⏰ **Reminder: Inspection Period Ending Soon**\n\nYour inspection period will end in ${Math.floor(hoursRemaining)} hours. Please complete your verification to release funds to the seller.`;
    } else {
      return new Response(
        JSON.stringify({ message: "No applicable reminder for this status and role" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Add the reminder message to the conversation
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: reminderMessage,
        sender_id: 'system'
      });
    
    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to send reminder", details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Reminder sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-escrow-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
