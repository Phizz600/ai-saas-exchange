
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Elements } from "@stripe/react-stripe-js";
import { AlertCircle } from "lucide-react";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { AmountDisplay } from "./AmountDisplay";
import { OfferPaymentForm } from "./OfferPaymentForm";

interface PaymentProcessingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethodId: string) => void;
  productTitle: string;
  offerAmount: number;
  clientSecret: string | null;
}

export function PaymentProcessingDialog({
  open,
  onClose,
  onConfirm,
  productTitle,
  offerAmount,
  clientSecret
}: PaymentProcessingDialogProps) {
  const [paymentElementVisible, setPaymentElementVisible] = useState(false);
  const { stripePromise, error: stripeError } = useStripeInitialization();

  useEffect(() => {
    if (open && clientSecret) {
      console.log("PaymentProcessingDialog opened with client secret, preparing to show payment element");
      const timer = setTimeout(() => {
        setPaymentElementVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setPaymentElementVisible(false);
    }
  }, [open, clientSecret]);

  if (!clientSecret || !stripePromise) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="exo-2-header">Authorize Payment for Offer</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <AmountDisplay productTitle={productTitle} offerAmount={offerAmount} />
          
          {stripeError ? (
            <div className="bg-red-50 p-4 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 mb-2" />
              <h3 className="font-medium text-red-800">Payment System Error</h3>
              <p className="text-sm text-red-700">{stripeError}</p>
              <p className="text-sm text-red-700 mt-2">Please try again later or contact support if the issue persists.</p>
            </div>
          ) : paymentElementVisible && clientSecret ? (
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
              <PaymentForm onConfirm={onConfirm} onClose={onClose} offerAmount={offerAmount} />
            </Elements>
          ) : (
            <div className="flex items-center justify-center p-6">
              <svg className="animate-spin h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-sm text-gray-600">Loading payment form...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
