
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard, LockIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51OC6VZFv3qy1KhE7jnKFZuqYvlUQ6GFWHZjIXfOy3vHEPLyfGxLCFE90rS7AO9VJkrP0bXpPOyQwVCHZkCdTDy7I00cMcNKl6D");

interface BidDepositDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethodId: string) => void;
  productId: string;
  bidAmount: number;
  productTitle: string;
  clientSecret?: string | null;
}

function PaymentForm({ onConfirm, onClose }: { onConfirm: (paymentMethodId: string) => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);
  const { toast } = useToast();

  // Track when the element is ready
  const handleReady = () => {
    console.log("Payment element is ready");
    setElementReady(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !elementReady) {
      // Stripe.js hasn't loaded yet or elements aren't ready
      setErrorMessage("Payment processing is still initializing. Please wait a moment.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      console.log("Starting payment confirmation process");
      
      // Get the PaymentElement instance
      const paymentElement = elements.getElement(PaymentElement);
      
      if (!paymentElement) {
        throw new Error("Payment element not found");
      }

      // Confirm the PaymentIntent with the card element
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/marketplace", // Redirect after payment
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "Payment failed");
        toast({
          title: "Payment Error",
          description: error.message || "There was a problem with your payment",
          variant: "destructive",
        });
      } else if (paymentIntent) {
        // The payment was successfully authorized
        console.log("Payment authorized successfully:", paymentIntent);
        toast({
          title: "Payment Authorized",
          description: "Your payment method has been authorized for your bid",
        });
        
        // Pass the payment method ID back to the parent component
        onConfirm(paymentIntent.id);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 text-blue-700">
        <LockIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Pre-Authorization Only</p>
          <p className="text-sm">Your card will only be authorized, not charged. We'll only capture payment if you win the auction.</p>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <PaymentElement onReady={handleReady} />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing || !elementReady}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Authorize Payment
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

export function BidDepositDialog({
  open,
  onClose,
  onConfirm,
  productId,
  bidAmount,
  productTitle,
  clientSecret
}: BidDepositDialogProps) {
  const [paymentElementVisible, setPaymentElementVisible] = useState(false);

  // Control the visibility of the payment element based on dialog state
  useEffect(() => {
    if (open && clientSecret) {
      console.log("BidDepositDialog opened with client secret, preparing to show payment element");
      // Small delay to ensure the dialog is fully open
      const timer = setTimeout(() => {
        setPaymentElementVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setPaymentElementVisible(false);
    }
  }, [open, clientSecret]);

  if (!clientSecret) {
    console.log("No client secret available, not rendering dialog");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authorize Payment for Bid</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Product:</span> {productTitle}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Bid Amount:</span> ${bidAmount.toLocaleString()}
            </p>
          </div>
          
          {paymentElementVisible && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#8B5CF6',
                  }
                }
              }}
            >
              <PaymentForm onConfirm={onConfirm} onClose={onClose} />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
