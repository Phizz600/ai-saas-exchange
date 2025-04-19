import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeInitialization } from "./hooks/useStripeInitialization";
import { PaymentForm } from "./components/PaymentForm";
import { ErrorAlert } from "./components/ErrorAlert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface BidDepositDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethodId: string) => void;
  productId: string;
  bidAmount: number;
  productTitle: string;
  clientSecret: string | null;
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
  const { stripePromise, error: stripeError } = useStripeInitialization();
  const [paymentElementVisible, setPaymentElementVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (open && clientSecret) {
      console.log("BidDepositDialog opened with client secret, preparing to show payment element");
      const timer = setTimeout(() => {
        setPaymentElementVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setPaymentElementVisible(false);
    }
  }, [open, clientSecret]);

  if (!clientSecret) {
    return null;
  }

  const formattedBidAmount = bidAmount ? bidAmount.toLocaleString() : "0";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-[#8B5CF6]" />
            Authorize Payment for Bid
          </DialogTitle>
          <DialogDescription>
            Complete your payment to secure the funds in escrow. 
            The seller will only receive the funds after you approve the delivery.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-md space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Product:</span> {productTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Bid Amount:</span> ${formattedBidAmount}
            </p>
          </div>
          
          <ErrorAlert error={stripeError} type="payment" />
          
          {paymentSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Your payment has been successfully processed. The funds are now secured in escrow.
              </AlertDescription>
            </Alert>
          )}
          
          {paymentElementVisible && clientSecret && !paymentSuccess && stripePromise && (
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
              <PaymentForm 
                onSuccess={() => {
                  setPaymentSuccess(true);
                  onConfirm(clientSecret);
                }}
                isVerifying={false}
              />
            </Elements>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            {paymentSuccess ? "Close" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
