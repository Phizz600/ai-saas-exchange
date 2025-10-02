import { FormEvent, useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

interface MarketplaceSubscriptionFormProps {
  onSuccess: (subscriptionId: string) => void;
  onCancel: () => void;
}

export function MarketplaceSubscriptionForm({ 
  onSuccess, 
  onCancel 
}: MarketplaceSubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);

  useEffect(() => {
    console.log("[MarketplaceSubscriptionForm] Stripe loaded:", !!stripe);
    console.log("[MarketplaceSubscriptionForm] Elements loaded:", !!elements);
  }, [stripe, elements]);

  const handleReady = () => {
    setElementReady(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/marketplace",
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        console.error("Payment error:", error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id);
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      console.error("Exception during payment:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-2 pb-4 border-b border-border">
          <h3 className="text-xl font-semibold">Marketplace Premium Access</h3>
          <p className="text-3xl font-bold">$49.95<span className="text-base text-muted-foreground">/month</span></p>
        </div>

        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        <PaymentElement onReady={handleReady} />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || !elementReady || isProcessing}
          className="flex-1 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:opacity-90"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            "Pay $49.95"
          )}
        </Button>
      </div>
    </form>
  );
}
