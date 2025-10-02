import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createMarketplaceSubscription, recordMarketplaceSubscription } from "@/services/stripe/subscription-payment.service";

interface UseMarketplaceSubscriptionProps {
  onSuccess: () => void;
}

export function useMarketplaceSubscription({ onSuccess }: UseMarketplaceSubscriptionProps) {
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  const subscriptionDetails = {
    amount: 49.95,
    name: 'Marketplace Premium Access'
  };

  const initiatePayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      const { clientSecret, paymentIntentId, error } = await createMarketplaceSubscription();
      
      if (error || !clientSecret) {
        throw new Error(error || "Failed to create subscription");
      }
      
      setPaymentClientSecret(clientSecret);
      setSubscriptionId(paymentIntentId);
      
      return true;
    } catch (error: any) {
      console.error("Error initiating subscription:", error);
      setPaymentError(error.message || "Failed to create subscription");
      
      toast({
        title: "Subscription initiation failed",
        description: error.message || "There was a problem setting up the subscription.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (subscriptionId: string) => {
    try {
      const result = await recordMarketplaceSubscription(
        subscriptionId,
        subscriptionDetails.amount
      );

      if (result.success) {
        toast({
          title: "Welcome to Premium!",
          description: "You now have full access to the marketplace.",
        });
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to record subscription");
      }
    } catch (error: any) {
      console.error("Error recording subscription:", error);
      toast({
        title: "Payment processed but recording failed",
        description: "Please contact support for assistance.",
        variant: "destructive",
      });
    }
  };

  const resetPayment = () => {
    setPaymentClientSecret(null);
    setSubscriptionId(null);
    setPaymentError(null);
    setIsProcessing(false);
  };

  return {
    paymentClientSecret,
    subscriptionId,
    isProcessing,
    paymentError,
    subscriptionDetails,
    initiatePayment,
    handlePaymentSuccess,
    resetPayment
  };
}
