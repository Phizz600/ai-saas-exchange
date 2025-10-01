import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
interface PackagePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
  packageName: string;
  amount: number;
}
export function PackagePaymentForm({
  onSuccess,
  onCancel,
  packageName,
  amount
}: PackagePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const {
        error,
        paymentIntent
      } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/list-product`
        },
        redirect: "if_required"
      });
      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred");
      setIsProcessing(false);
    }
  };
  const handleReady = () => {
    setElementReady(true);
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="font-semibold text-white">{packageName}</h4>
        <p className="text-sm text-gray-400">${amount} one-time payment</p>
      </div>

      <div className="space-y-3">
        <PaymentElement onReady={handleReady} />
        
        {errorMessage && <div className="text-red-400 text-sm text-center">
            {errorMessage}
          </div>}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing} className="flex-1 border-gray-600 hover:bg-gray-800 text-slate-50">
          Cancel
        </Button>
        
        <Button type="submit" disabled={!elementReady || isProcessing || !stripe || !elements} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          {isProcessing ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </> : `Pay $${amount}`}
        </Button>
      </div>
    </form>;
}