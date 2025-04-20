
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CreditCard } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { PaymentFormWrapper } from "@/components/payments/PaymentFormWrapper";
import { TransactionSummaryCard } from "./components/TransactionSummaryCard";
import { usePaymentInitialization } from "./hooks/usePaymentInitialization";
import { EscrowTransaction } from "@/integrations/supabase/escrow";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: EscrowTransaction;
  onPaymentComplete: (paymentIntentId: string) => void;
  error: string | null;
  isVerifying: boolean;
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  transaction,
  onPaymentComplete,
  error: paymentError,
  isVerifying
}: PaymentMethodDialogProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { stripePromise, error: stripeError } = useStripeInitialization();
  const { clientSecret, paymentIntentId, isLoading, reset } = usePaymentInitialization({
    open,
    transaction,
    onOpenChange
  });

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !paymentSuccess) {
      reset();
    }
    onOpenChange(newOpen);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess(true);
    onPaymentComplete(paymentIntentId);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <TransactionSummaryCard transaction={transaction} />
          
          {(paymentError || stripeError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {paymentError || stripeError || 'An error occurred with the payment system'}
              </AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B5CF6]"></div>
              <p className="mt-4 text-muted-foreground text-sm">Initializing payment...</p>
            </div>
          ) : clientSecret && stripePromise ? (
            <PaymentFormWrapper
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              amount={transaction.amount + transaction.platform_fee + transaction.escrow_fee}
              isVerifying={isVerifying}
              error={paymentError}
            />
          ) : null}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isLoading || isVerifying}
          >
            {paymentSuccess ? "Close" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
