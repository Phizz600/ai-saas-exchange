
import { supabase } from "./client";

/**
 * Call edge function to complete escrow transaction.
 * Only the buyer may invoke this.
 */
export async function completeEscrowTransaction(escrowTransactionId: string) {
  const { data, error } = await supabase.functions.invoke("complete-escrow-transaction", {
    body: { escrowTransactionId }
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
