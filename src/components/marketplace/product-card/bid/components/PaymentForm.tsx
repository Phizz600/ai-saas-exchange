
import { PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { usePaymentForm } from "../hooks/usePaymentForm";

interface PaymentFormProps {
  onSuccess: () => void;
  isVerifying: boolean;
}

export function PaymentForm({ onSuccess, isVerifying }: PaymentFormProps) {
  const { handleSubmit, message, isProcessing, isReady } = usePaymentForm({
    onSuccess,
    isVerifying
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {message && (
        <div className="text-sm text-red-500 mt-2">{message}</div>
      )}
      
      <Button 
        type="submit" 
        disabled={!isReady || isProcessing || isVerifying}
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
