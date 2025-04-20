
import { PaymentElement } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PaymentFormWrapperProps {
  clientSecret: string | null;
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
  isVerifying?: boolean;
  error?: string | null;
}

export function PaymentFormWrapper({
  clientSecret,
  onSuccess,
  amount,
  isVerifying,
  error
}: PaymentFormWrapperProps) {
  const { stripePromise, error: stripeError } = useStripeInitialization();

  if (!clientSecret || !stripePromise) {
    return null;
  }

  return (
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
      <div className="space-y-4">
        {(error || stripeError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || stripeError || 'An error occurred with the payment system'}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
        </div>

        <PaymentElement />
        
        <Button 
          type="submit" 
          disabled={isVerifying}
          className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:opacity-90"
        >
          {isVerifying ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Processing...</>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-1" />
              Pay Now
            </>
          )}
        </Button>
      </div>
    </Elements>
  );
}
