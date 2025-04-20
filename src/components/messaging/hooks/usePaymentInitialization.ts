
import { useState, useEffect } from "react";
import { createPaymentAuthorization } from "@/services/stripe";
import { EscrowTransaction } from "@/integrations/supabase/escrow";
import { toast } from "sonner";

interface UsePaymentInitializationProps {
  open: boolean;
  transaction: EscrowTransaction;
  onOpenChange: (open: boolean) => void;
}

export function usePaymentInitialization({ 
  open, 
  transaction, 
  onOpenChange 
}: UsePaymentInitializationProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      if (open && !clientSecret) {
        try {
          setIsLoading(true);
          
          const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
            transaction.amount + transaction.platform_fee + transaction.escrow_fee,
            "escrow-" + transaction.id,
            transaction.product_id
          );
          
          if (error || !clientSecret) {
            toast({
              title: "Payment initialization failed",
              description: error || "Could not initialize payment. Please try again.",
              variant: "destructive"
            });
            onOpenChange(false);
            return;
          }
          
          setClientSecret(clientSecret);
          setPaymentIntentId(paymentIntentId);
        } catch (err: any) {
          console.error("Error initializing payment:", err);
          toast({
            title: "Payment initialization failed",
            description: err.message || "Something went wrong. Please try again.",
            variant: "destructive"
          });
          onOpenChange(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializePayment();
  }, [open, clientSecret, transaction, onOpenChange]);

  return {
    clientSecret,
    paymentIntentId,
    isLoading,
    reset: () => setClientSecret(null)
  };
}
