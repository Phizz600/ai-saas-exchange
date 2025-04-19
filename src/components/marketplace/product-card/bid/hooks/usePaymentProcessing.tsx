
import { useState } from "react";
import { createPaymentAuthorization } from "@/services/stripe-service";
import { toast } from "sonner";

interface UsePaymentProcessingProps {
  productId: string;
  onSuccess?: () => void;
}

export function usePaymentProcessing({ productId, onSuccess }: UsePaymentProcessingProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const initializePayment = async (amount: number, bidId: string) => {
    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      console.log(`Creating payment authorization for amount: ${amount}, bidId: ${bidId}`);
      const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
        amount,
        bidId,
        productId
      );

      if (error || !clientSecret) {
        console.error('Payment authorization error:', error);
        setPaymentError(error || "Failed to create payment authorization");
        toast("Payment setup failed", {
          description: error || "There was a problem setting up the payment",
          variant: "destructive"
        });
        return false;
      }

      console.log('Payment authorization created successfully with client secret');
      setPaymentClientSecret(clientSecret);
      return true;

    } catch (err: any) {
      console.error('Error initializing payment:', err);
      setPaymentError(err.message || "An unexpected error occurred");
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetPayment = () => {
    setPaymentClientSecret(null);
    setPaymentError(null);
  };

  return {
    initializePayment,
    resetPayment,
    isProcessingPayment,
    paymentClientSecret,
    paymentError
  };
}
