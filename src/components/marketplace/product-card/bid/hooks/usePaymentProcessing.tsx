
import { useState } from "react";
import { createPaymentAuthorization } from "@/services/stripe";
import { usePaymentState } from "./usePaymentState";
import { toast } from "sonner";

interface UsePaymentProcessingProps {
  productId: string;
  onSuccess?: () => void;
}

export function usePaymentProcessing({ productId, onSuccess }: UsePaymentProcessingProps) {
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const { isProcessing, error: paymentError, startProcessing, setError, reset } = usePaymentState();

  const initializePayment = async (amount: number, bidId: string) => {
    try {
      startProcessing();
      reset();

      console.log(`Creating payment authorization for amount: ${amount}, bidId: ${bidId}`);
      const { clientSecret, error } = await createPaymentAuthorization(
        amount,
        bidId,
        productId
      );

      if (error || !clientSecret) {
        console.error('Payment authorization error:', error);
        setError(error || "Failed to create payment authorization");
        toast.error("Payment setup failed", {
          description: error || "There was a problem setting up the payment"
        });
        return false;
      }

      console.log('Payment authorization created successfully with client secret');
      setPaymentClientSecret(clientSecret);
      return true;

    } catch (err: any) {
      console.error('Error initializing payment:', err);
      setError(err.message || "An unexpected error occurred");
      return false;
    }
  };

  const resetPayment = () => {
    setPaymentClientSecret(null);
    reset();
  };

  return {
    initializePayment,
    resetPayment,
    isProcessingPayment: isProcessing,
    paymentClientSecret,
    paymentError
  };
}
