
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function submitNewOffer(
  productId: string,
  userId: string,
  amount: number,
  message: string,
  paymentIntentId: string
) {
  const { data: offer, error } = await supabase
    .from('offers')
    .insert({
      product_id: productId,
      bidder_id: userId,
      amount: amount,
      message: message,
      status: 'pending',
      payment_intent_id: paymentIntentId,
      payment_status: 'authorized'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return offer;
}

export async function updateExistingOffer(
  offerId: string,
  amount: number,
  message: string
) {
  const { data: updatedOffer, error } = await supabase
    .from('offers')
    .update({
      amount: amount,
      message: message,
      updated_at: new Date().toISOString()
    })
    .eq('id', offerId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return updatedOffer;
}
