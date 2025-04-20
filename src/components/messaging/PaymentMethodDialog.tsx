import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentAuthorization } from "@/services/stripe-service";
import { EscrowTransaction } from "@/integrations/supabase/escrow";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: EscrowTransaction;
  onPaymentComplete: (paymentIntentId: string) => void;
  error: string | null;
  isVerifying: boolean;
}

export const PaymentMethodDialog = ({
  open,
  onOpenChange,
  transaction,
  onPaymentComplete,
  error,
  isVerifying
}: PaymentMethodDialogProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { stripePromise, error: stripeError } = useStripeInitialization();
  const { toast } = useToast();

  useEffect(() => {
    const initializePayment = async () => {
      if (open && !clientSecret && !paymentSuccess) {
        try {
          setIsLoading(true);
          
          const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
            transaction.amount + transaction.platform_fee + transaction.escrow_fee,
            "escrow-" + transaction.id,
            transaction.product_id
          );
          
          if (error || !clientSecret) {
            toast({
              title: "Payment initialization failed",
              description: error || "Could not initialize payment. Please try again.",
              variant: "destructive"
            });
            onOpenChange(false);
            return;
          }
          
          setClientSecret(clientSecret);
          setPaymentIntentId(paymentIntentId);
        } catch (err: any) {
          console.error("Error initializing payment:", err);
          toast({
            title: "Payment initialization failed",
            description: err.message || "Something went wrong. Please try again.",
            variant: "destructive"
          });
          onOpenChange(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializePayment();
  }, [open, clientSecret, paymentSuccess, transaction, toast, onOpenChange]);

  useEffect(() => {
    if (!open) {
      if (!paymentSuccess) {
        setClientSecret(null);
        setPaymentIntentId(null);
      }
    }
  }, [open, paymentSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-[#8B5CF6]" />
            Payment for Escrow Transaction
          </DialogTitle>
          <DialogDescription>
            Complete your payment to secure the funds in escrow. 
            The seller will only receive the funds after you approve the delivery.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Product Amount:</span>
              <span className="font-medium">${transaction.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Platform Fee:</span>
              <span className="font-medium">${transaction.platform_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Escrow Fee:</span>
              <span className="font-medium">${transaction.escrow_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-medium">Total:</span>
              <span className="font-bold">
                ${(transaction.amount + transaction.platform_fee + transaction.escrow_fee).toFixed(2)}
              </span>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {paymentSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Your payment has been successfully processed. The funds are now secured in escrow.
              </AlertDescription>
            </Alert>
          )}
          
          {clientSecret && !paymentSuccess && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                onSuccess={() => {
                  setPaymentSuccess(true);
                  onPaymentComplete(paymentIntentId!);
                }}
                isVerifying={isVerifying}
              />
            </Elements>
          )}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B5CF6]"></div>
              <p className="mt-4 text-muted-foreground text-sm">Initializing payment...</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading || isVerifying}
          >
            {paymentSuccess ? "Close" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function CheckoutForm({ 
  onSuccess, 
  isVerifying 
}: { 
  onSuccess: () => void;
  isVerifying: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Payment authorized",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {message && (
        <div className="text-sm text-red-500 mt-2">{message}</div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing || isVerifying}
        className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:opacity-90"
      >
        {isProcessing || isVerifying ? (
          <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Processing...</>
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-1" />
            Pay ${isVerifying ? "..." : "Now"}
          </>
        )}
      </Button>
    </form>
  );
}
