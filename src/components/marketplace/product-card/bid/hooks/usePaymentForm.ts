
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

interface UsePaymentFormProps {
  onSuccess: () => void;
  isVerifying: boolean;
}

export function usePaymentForm({ onSuccess, isVerifying }: UsePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setIsProcessing(true);
      setMessage(null);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
      } else {
        toast.success("Payment authorized", {
          description: "Your payment has been successfully authorized."
        });
        onSuccess();
      }
    } catch (err: any) {
      setMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    message,
    isProcessing,
    isReady: !!stripe && !!elements
  };
}
