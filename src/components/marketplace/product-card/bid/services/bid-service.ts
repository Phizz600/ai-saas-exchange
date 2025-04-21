
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a bid in the database
 */
export async function createBid(
  productId: string,
  amount: number
) {
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Authentication required to place a bid");
  }

  // Get the latest product data to verify the current price
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('highest_bid, current_price, reserve_price, listing_type')
    .eq('id', productId)
    .single();
    
  if (productError) {
    console.error('Error fetching product for validation:', productError);
    throw new Error("Could not verify current auction price");
  }
  
  // Check if this is a Dutch auction with existing winner
  if (product.listing_type === 'dutch_auction' && product.highest_bid) {
    throw new Error("This Dutch auction already has a winner");
  }

  // Create a pending bid
  const { data: bid, error: bidError } = await supabase
    .from('bids')
    .insert({
      product_id: productId,
      bidder_id: user.id,
      amount: amount,
      status: 'pending'
    })
    .select()
    .single();

  if (bidError) {
    console.error('Error creating bid:', bidError);
    throw bidError;
  }

  console.log('Bid created successfully:', bid);
  return bid.id;
}

/**
 * Updates a bid status to active and updates the payment status
 */
export async function activateBid(bidId: string, paymentIntentId: string) {
  const { error } = await supabase
    .from('bids')
    .update({
      status: 'active',
      payment_status: 'authorized',
      payment_intent_id: paymentIntentId
    })
    .eq('id', bidId);

  if (error) {
    console.error('Error activating bid:', error);
    throw error;
  }

  return true;
}

/**
 * Cancels a bid
 */
export async function cancelBid(bidId: string) {
  const { error } = await supabase
    .from('bids')
    .update({
      status: 'cancelled',
      payment_status: 'cancelled'
    })
    .eq('id', bidId);

  if (error) {
    console.error('Error cancelling bid:', error);
    throw error;
  }

  return true;
}
