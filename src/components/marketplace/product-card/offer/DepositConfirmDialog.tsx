
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DepositDetails } from "./components/DepositDetails";
import { createPaymentAuthorization } from "@/services/stripe-service";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface DepositConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerAmount: number;
  productTitle: string;
  productId: string;
  onDepositComplete: (paymentIntentId: string) => void;
  isUpdatingOffer?: boolean;
  additionalDepositAmount?: number;
}

export function DepositConfirmDialog({
  open,
  onOpenChange,
  offerAmount,
  productTitle,
  productId,
  onDepositComplete,
  isUpdatingOffer = false,
  additionalDepositAmount = 0
}: DepositConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Calculate deposit amount
  const depositAmount = isUpdatingOffer && additionalDepositAmount > 0 
    ? additionalDepositAmount 
    : Math.round(offerAmount * 0.1 * 100) / 100;
    
  const platformFee = Math.round(depositAmount * 0.05 * 100) / 100;
  const totalAmount = depositAmount + platformFee;

  // Initialize payment when dialog opens
  useEffect(() => {
    const initializePayment = async () => {
      if (open && !clientSecret) {
        try {
          setIsSubmitting(true);
          
          const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
            totalAmount,
            `offer-deposit-${Date.now()}`,
            productId
          );
          
          if (error || !clientSecret) {
            setError(error || "Could not initialize payment. Please try again.");
            toast({
              title: "Payment initialization failed",
              description: error || "Could not initialize payment. Please try again.",
              variant: "destructive"
            });
            return;
          }
          
          setClientSecret(clientSecret);
          setPaymentIntentId(paymentIntentId);
        } catch (err: any) {
          console.error("Error initializing payment:", err);
          setError(err.message || "An unexpected error occurred");
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    
    initializePayment();
  }, [open, clientSecret, toast, totalAmount, productId]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold exo-2-title">
            {isUpdatingOffer ? "Confirm Additional Deposit" : "Confirm Offer Deposit"}
          </DialogTitle>
          <DialogDescription>
            {isUpdatingOffer
              ? "You're increasing your offer by more than 20%, which requires an additional deposit."
              : "To verify your offer is genuine, we require a 10% deposit through our secure escrow service."}
          </DialogDescription>
        </DialogHeader>

        <DepositDetails 
          productTitle={productTitle}
          offerAmount={offerAmount}
          depositAmount={depositAmount}
          platformFee={platformFee}
          totalAmount={totalAmount}
          isAdditionalDeposit={isUpdatingOffer && additionalDepositAmount > 0}
        />

        {/* Payment Form */}
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm 
              onSuccess={(paymentIntentId) => {
                // Pass the payment intent ID back to the parent
                onDepositComplete(paymentIntentId);
                // Close the dialog
                onOpenChange(false);
              }}
              error={error}
              setError={setError}
              paymentIntentId={paymentIntentId}
            />
          </Elements>
        ) : (
          <div className="flex justify-center py-4">
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <p className="text-sm text-gray-500">Preparing payment form...</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Payment Form Component
function PaymentForm({ 
  onSuccess, 
  error,
  setError,
  paymentIntentId
}: { 
  onSuccess: (paymentIntentId: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  paymentIntentId: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntentId) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // We'll handle the redirect ourselves
        },
        redirect: "if_required",
      });

      if (error) {
        setError(error.message || "An unexpected error occurred.");
        toast({
          title: "Payment failed",
          description: error.message || "There was a problem processing your payment.",
          variant: "destructive",
        });
      } else {
        // The payment has been processed!
        toast({
          title: "Payment authorized",
          description: "Your payment has been successfully authorized."
        });
        onSuccess(paymentIntentId);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <PaymentElement />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Pay Deposit</span>
          </div>
        )}
      </Button>
    </form>
  );
}
