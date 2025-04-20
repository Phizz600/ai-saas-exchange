
import { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

export function usePaymentProcessing(onConfirm: (paymentMethodId: string) => void) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) {
      console.log("Stripe.js hasn't loaded yet");
    }
  }, [stripe, elements]);

  const handleReady = () => {
    console.log("Payment element is ready");
    setElementReady(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !elementReady) {
      setErrorMessage("Payment processing is still initializing. Please wait a moment.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      console.log("Starting payment confirmation process");
      
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/marketplace",
          payment_method_data: {
            billing_details: {
              address: {
                country: 'US',
                postal_code: '10001',
                line1: '123 Default Address',
                city: 'New York',
                state: 'NY'
              }
            }
          }
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "Payment failed");
        toast("Payment Error", {
          description: error.message || "There was a problem with your payment"
        });
      } else if (paymentIntent) {
        console.log("Payment authorized successfully:", paymentIntent);
        toast("Payment Authorized", {
          description: "Your payment method has been authorized for your offer"
        });
        
        onConfirm(paymentIntent.id);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
      toast("Error", {
        description: err.message || "An unexpected error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    handleReady,
    isProcessing,
    errorMessage,
    elementReady
  };
}
