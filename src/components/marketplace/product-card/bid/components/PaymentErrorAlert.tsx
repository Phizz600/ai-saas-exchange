
import { ErrorAlert } from './ErrorAlert';

interface PaymentErrorAlertProps {
  paymentError: string | null;
}

export function PaymentErrorAlert({ paymentError }: PaymentErrorAlertProps) {
  return <ErrorAlert error={paymentError} type="payment" />;
}
