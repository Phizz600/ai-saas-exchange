import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createPackagePayment, recordPackagePurchase } from "@/services/stripe/package-payment.service";

interface UsePackagePaymentProps {
  packageType: 'featured-listing' | 'premium-exit' | 'featured-listing-downsell' | 'premium-exit-downsell';
  onSuccess: () => void;
}

export function usePackagePayment({ packageType, onSuccess }: UsePackagePaymentProps) {
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  const packageDetails = {
    'featured-listing': { amount: 199, name: 'Featured Listing Package' },
    'premium-exit': { amount: 2500, name: 'Premium Exit Package' },
    'featured-listing-downsell': { amount: 99.50, name: 'Featured Listing Package' },
    'premium-exit-downsell': { amount: 1250, name: 'Premium Exit Package' }
  };

  const initiatePayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      const { clientSecret, paymentIntentId, error } = await createPackagePayment(packageType);
      
      if (error || !clientSecret) {
        throw new Error(error || "Failed to create payment");
      }
      
      setPaymentClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      
      return true;
    } catch (error: any) {
      console.error("Error initiating package payment:", error);
      setPaymentError(error.message || "Failed to create payment");
      
      toast({
        title: "Payment initiation failed",
        description: error.message || "There was a problem setting up the payment.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const packageInfo = packageDetails[packageType];
      const result = await recordPackagePurchase(
        packageType,
        packageInfo.amount,
        paymentIntentId
      );

      if (result.success) {
        toast({
          title: "Payment successful!",
          description: `${packageInfo.name} purchased successfully. You can now proceed with listing.`,
        });
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to record purchase");
      }
    } catch (error: any) {
      console.error("Error recording package purchase:", error);
      toast({
        title: "Payment processed but recording failed",
        description: "Please contact support for assistance.",
        variant: "destructive",
      });
    }
  };

  const resetPayment = () => {
    setPaymentClientSecret(null);
    setPaymentIntentId(null);
    setPaymentError(null);
    setIsProcessing(false);
  };

  return {
    paymentClientSecret,
    paymentIntentId,
    isProcessing,
    paymentError,
    packageDetails: packageDetails[packageType],
    initiatePayment,
    handlePaymentSuccess,
    resetPayment
  };
}