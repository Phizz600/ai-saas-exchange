
import { useState } from "react";
import { completeEscrowTransaction } from "@/integrations/supabase/escrow-action";
import { toast } from "@/hooks/use-toast";

export function useEscrowCompletion({ escrowTransactionId, onCompleted }: { escrowTransactionId: string, onCompleted: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeTransaction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await completeEscrowTransaction(escrowTransactionId);
      toast({
        title: "Transaction Completed!",
        description: "Funds have been released. Both parties have been notified."
      });
      if (onCompleted) onCompleted();
    } catch (e: any) {
      setError(e?.message ?? "Failed to complete transaction");
      toast({
        title: "Error",
        description: e?.message ?? "Failed to complete transaction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { completeTransaction, isLoading, error };
}
