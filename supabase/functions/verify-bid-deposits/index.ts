
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify deposits with pending status
    const { data: depositTransactions, error: fetchError } = await supabase
      .from('deposit_transactions')
      .select(`
        id,
        status,
        amount,
        escrow_transaction_id,
        bid_id,
        offer_id,
        created_at
      `)
      .eq('status', 'pending');

    if (fetchError) {
      throw new Error(`Error fetching deposit transactions: ${fetchError.message}`);
    }

    console.log(`Found ${depositTransactions?.length || 0} pending deposit transactions`);

    // Process each transaction
    const updates = [];
    for (const transaction of depositTransactions || []) {
      try {
        // Get escrow transaction status
        const { data: escrowTx, error: escrowError } = await supabase
          .from('escrow_transactions')
          .select('status')
          .eq('id', transaction.escrow_transaction_id)
          .single();

        if (escrowError) {
          console.error(`Error fetching escrow for transaction ${transaction.id}: ${escrowError.message}`);
          continue;
        }

        // If escrow is confirmed, update the deposit and bid/offer status
        if (escrowTx?.status === 'deposit_confirmed' || escrowTx?.status === 'payment_received') {
          // Update deposit transaction
          const { error: updateError } = await supabase
            .from('deposit_transactions')
            .update({ status: 'confirmed' })
            .eq('id', transaction.id);

          if (updateError) {
            console.error(`Error updating deposit ${transaction.id}: ${updateError.message}`);
            continue;
          }

          // Update bid if present
          if (transaction.bid_id) {
            const { error: bidError } = await supabase
              .from('bids')
              .update({ status: 'active', deposit_status: 'confirmed' })
              .eq('id', transaction.bid_id);

            if (bidError) {
              console.error(`Error updating bid ${transaction.bid_id}: ${bidError.message}`);
            } else {
              console.log(`Updated bid ${transaction.bid_id} to active status`);
              
              // Get bid details to update product's highest bid if needed
              const { data: bid } = await supabase
                .from('bids')
                .select('*')
                .eq('id', transaction.bid_id)
                .single();
                
              if (bid) {
                try {
                  // Call the RPC function to update highest bid if higher
                  const { error: rpcError } = await supabase.rpc('update_highest_bid_if_higher', {
                    p_product_id: bid.product_id,
                    p_bid_amount: bid.amount,
                    p_bidder_id: bid.bidder_id
                  });
                  
                  if (rpcError) {
                    console.error(`Error updating highest bid: ${rpcError.message}`);
                  } else {
                    console.log(`Successfully updated highest bid for product ${bid.product_id}`);
                  }
                } catch (err) {
                  console.error(`Error calling update_highest_bid_if_higher: ${err.message}`);
                }
              }
            }
          }

          // Update offer if present
          if (transaction.offer_id) {
            const { error: offerError } = await supabase
              .from('offers')
              .update({ deposit_status: 'confirmed' })
              .eq('id', transaction.offer_id);

            if (offerError) {
              console.error(`Error updating offer ${transaction.offer_id}: ${offerError.message}`);
            } else {
              console.log(`Updated offer ${transaction.offer_id} deposit status to confirmed`);
            }
          }

          updates.push(`Transaction ${transaction.id} processed successfully`);
        } else {
          updates.push(`Transaction ${transaction.id} escrow status is ${escrowTx?.status}, no update needed`);
        }
      } catch (err) {
        console.error(`Error processing transaction ${transaction.id}:`, err);
        updates.push(`Error with transaction ${transaction.id}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: updates.length,
      updates 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in verify-bid-deposits function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
