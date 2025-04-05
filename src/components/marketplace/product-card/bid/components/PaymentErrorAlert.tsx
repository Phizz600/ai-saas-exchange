
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PaymentErrorAlertProps {
  paymentError: string | null;
}

export function PaymentErrorAlert({ paymentError }: PaymentErrorAlertProps) {
  if (!paymentError) return null;
  
  return (
    <Alert variant="destructive" className="mb-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Payment error: {paymentError}. Please try again with a different payment method.
      </AlertDescription>
    </Alert>
  );
}
