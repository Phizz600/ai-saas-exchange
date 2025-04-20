import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { PaymentProcessingDialog } from "./PaymentProcessingDialog";

interface OfferFormProps {
  amount: string;
  message: string;
  formattedAmount: string;
  isSubmitting: boolean;
  productId: string;
  existingOffer?: any;
  isUpdatingOffer?: boolean;
  paymentClientSecret: string | null;
  paymentProcessingOpen: boolean;
  paymentError: string | null;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInitiateOffer: () => void;
  onPaymentSuccess: (paymentMethodId: string) => void;
  onPaymentCancel: () => void;
  productTitle: string;
}

export function OfferForm({
  amount,
  message,
  formattedAmount,
  isSubmitting,
  productId,
  existingOffer,
  isUpdatingOffer = false,
  paymentClientSecret,
  paymentProcessingOpen,
  paymentError,
  onAmountChange,
  onMessageChange,
  onInitiateOffer,
  onPaymentSuccess,
  onPaymentCancel,
  productTitle
}: OfferFormProps) {
  return (
    <div className="space-y-4">
      {paymentError && (
        <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Payment Error</p>
            <p className="text-sm">{paymentError}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="amount">Offer Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={onAmountChange}
            className="pl-7"
            placeholder="Enter amount"
            disabled={isSubmitting}
          />
        </div>
        {formattedAmount && (
          <div className="text-sm text-gray-500">
            Your offer: {formattedAmount}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Enter any amount you'd like to offer. The seller will review your offer and can accept or decline it.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message to Seller (Optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={onMessageChange}
          placeholder="Add details about your offer..."
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        onClick={onInitiateOffer} 
        disabled={isSubmitting || !amount} 
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : isUpdatingOffer ? "Update Offer" : "Submit Offer"}
      </Button>
      
      <PaymentProcessingDialog
        open={paymentProcessingOpen}
        onClose={onPaymentCancel}
        onConfirm={onPaymentSuccess}
        productTitle={productTitle}
        offerAmount={parseFloat(amount) || 0}
        clientSecret={paymentClientSecret}
      />
    </div>
  );
}
