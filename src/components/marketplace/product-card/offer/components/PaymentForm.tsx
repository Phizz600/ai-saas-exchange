
import { usePaymentProcessing } from "../hooks/usePaymentProcessing";
import { OfferPaymentForm } from "./OfferPaymentForm";

interface PaymentFormProps {
  onConfirm: (paymentMethodId: string) => void;
  onClose: () => void;
  offerAmount: number;
}

export function PaymentForm({ onConfirm, onClose, offerAmount }: PaymentFormProps) {
  const {
    handleSubmit,
    handleReady,
    isProcessing,
    errorMessage,
    elementReady
  } = usePaymentProcessing(onConfirm);

  return (
    <OfferPaymentForm
      onConfirm={onConfirm}
      onClose={onClose}
      offerAmount={offerAmount}
      elementReady={elementReady}
      isProcessing={isProcessing}
      errorMessage={errorMessage}
      handleSubmit={handleSubmit}
    />
  );
}
