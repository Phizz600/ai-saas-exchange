
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createPaymentAuthorization } from "@/services/stripe-service";

interface UseOfferPaymentProps {
  productId: string;
}

export function useOfferPayment({ productId }: UseOfferPaymentProps) {
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentProcessingOpen, setPaymentProcessingOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreatePaymentAuthorization = async (numericAmount: number) => {
    try {
      setPaymentError(null);
      
      const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
        numericAmount,
        "offer-" + Date.now(),
        productId
      );
      
      if (error || !clientSecret) {
        throw new Error(error || "Failed to create payment authorization");
      }
      
      setPaymentClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      setPaymentProcessingOpen(true);
      
      return true;
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      setPaymentError(error.message || "Failed to create payment");
      
      toast({
        title: "Payment initiation failed",
        description: error.message || "There was a problem setting up the payment.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const handlePaymentCancel = () => {
    setPaymentProcessingOpen(false);
    setPaymentClientSecret(null);
    setPaymentIntentId(null);
  };

  return {
    paymentClientSecret,
    paymentIntentId,
    paymentProcessingOpen,
    paymentError,
    handleCreatePaymentAuthorization,
    handlePaymentCancel,
    setPaymentProcessingOpen
  };
}
