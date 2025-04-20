
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfferPaymentFormProps {
  onConfirm: (paymentMethodId: string) => void;
  onClose: () => void;
  offerAmount: number;
  elementReady: boolean;
  isProcessing: boolean;
  errorMessage: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function OfferPaymentForm({
  onConfirm,
  onClose,
  offerAmount,
  elementReady,
  isProcessing,
  errorMessage,
  handleSubmit
}: OfferPaymentFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700">
          <AlertCircle className="h-5 w-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 text-blue-700">
        <div>
          <p className="font-medium">Pre-Authorization Only</p>
          <p className="text-sm">Your card will only be authorized, not charged. This confirms your offer is backed by a valid payment method.</p>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <PaymentElement options={{
          fields: {
            billingDetails: 'auto'
          }
        }} />
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
          disabled={isProcessing || !elementReady}
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
            "Authorize Payment"
          )}
        </Button>
      </div>
    </form>
  );
}
