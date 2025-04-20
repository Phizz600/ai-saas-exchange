
import { useEffect } from "react";
import { createPaymentAuthorization } from "@/services/stripe";
import { EscrowTransaction } from "@/integrations/supabase/escrow";
import { toast } from "sonner";
import { usePaymentState } from "./usePaymentState";

interface UsePaymentSetupProps {
  open: boolean;
  transaction: EscrowTransaction;
  onOpenChange: (open: boolean) => void;
}

export function usePaymentSetup({ 
  open, 
  transaction, 
  onOpenChange 
}: UsePaymentSetupProps) {
  const {
    clientSecret,
    paymentIntentId,
    isLoading,
    setLoading,
    setPaymentDetails,
    reset
  } = usePaymentState();

  useEffect(() => {
    const initializePayment = async () => {
      if (open && !clientSecret) {
        try {
          setLoading(true);
          
          const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
            transaction.amount + transaction.platform_fee + transaction.escrow_fee,
            "escrow-" + transaction.id,
            transaction.product_id
          );
          
          if (error || !clientSecret) {
            toast("Could not initialize payment. Please try again.");
            onOpenChange(false);
            return;
          }
          
          setPaymentDetails(clientSecret, paymentIntentId);
        } catch (err: any) {
          console.error("Error initializing payment:", err);
          toast("Something went wrong. Please try again.");
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      }
    };
    
    initializePayment();
  }, [open, clientSecret, transaction, onOpenChange, setLoading, setPaymentDetails]);

  return {
    clientSecret,
    paymentIntentId,
    isLoading,
    reset
  };
}
