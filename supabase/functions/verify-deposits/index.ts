
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

    // Check if this is a scheduled function call or manual
    const { isScheduled } = await req.json();
    
    // Get pending deposit transactions that need verification
    const { data: pendingDeposits, error: depositError } = await supabase
      .from("escrow_transactions")
      .select("id, escrow_api_id, buyer_id, seller_id, product_id, amount")
      .eq("status", "deposit_pending")
      .not("escrow_api_id", "is", null);
      
    if (depositError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch pending deposits", details: depositError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${pendingDeposits.length} pending deposits to verify`);
    
    // Track the results
    const results = [];
    
    // Check each pending deposit
    for (const deposit of pendingDeposits) {
      try {
        // Call Escrow.com API to check status
        const escrowApiUrl = `https://api.escrow.com/2017-09-01/transaction/${deposit.escrow_api_id}/status`;
        
        console.log(`Checking status for escrow transaction: ${deposit.escrow_api_id}`);
        
        const escrowResponse = await fetch(escrowApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(escrowApiKey + ":")}`,
          },
        });
        
        if (!escrowResponse.ok) {
          console.error(`Error getting status for transaction ${deposit.escrow_api_id}: ${escrowResponse.status}`);
          results.push({
            id: deposit.id,
            verified: false,
            error: `API error: ${escrowResponse.status}`
          });
          continue;
        }
        
        const escrowData = await escrowResponse.json();
        console.log(`Escrow status for ${deposit.escrow_api_id}: ${escrowData.status}`);
        
        // Check if the deposit has been paid
        const depositPaid = escrowData.status?.toLowerCase() === 'in broker' || 
                           escrowData.status?.toLowerCase() === 'closed';
        
        if (depositPaid) {
          // Update the escrow transaction status
          await supabase
            .from("escrow_transactions")
            .update({
              status: 'deposit_paid'
            })
            .eq("id", deposit.id);
            
          // Find and update the offer associated with this deposit
          const { data: offers, error: offerError } = await supabase
            .from("offers")
            .select("id, amount, bidder_id, product:products(seller_id, title)")
            .eq("deposit_transaction_id", deposit.id);
            
          if (!offerError && offers && offers.length > 0) {
            // Update the offer status
            await supabase
              .from("offers")
              .update({
                deposit_status: 'deposit_paid',
                status: 'pending' // Now the offer is actually pending seller review
              })
              .eq("id", offers[0].id);
              
            // Notify seller about the verified offer
            await supabase.from("notifications").insert({
              user_id: offers[0].product.seller_id,
              title: "Verified Offer Received",
              message: `You received a verified offer of $${offers[0].amount} for ${offers[0].product.title}. The buyer has already made a deposit.`,
              type: "verified_offer",
              related_product_id: deposit.product_id
            });
            
            // Notify buyer that their deposit was verified
            await supabase.from("notifications").insert({
              user_id: offers[0].bidder_id,
              title: "Deposit Verified",
              message: `Your deposit of $${deposit.amount} has been verified. Your offer is now pending seller review.`,
              type: "deposit_verified",
              related_product_id: deposit.product_id
            });
          }
          
          results.push({
            id: deposit.id,
            verified: true,
            status: 'deposit_paid'
          });
        } else {
          results.push({
            id: deposit.id,
            verified: false,
            status: escrowData.status
          });
        }
      } catch (error) {
        console.error(`Error verifying deposit ${deposit.id}:`, error);
        results.push({
          id: deposit.id,
          verified: false,
          error: error.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        checked: pendingDeposits.length,
        results
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in verify-deposits function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
