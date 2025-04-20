
import { useState } from 'react';
import { PaymentError, PaymentErrorType, createPaymentError } from '@/lib/error-handling/payment-errors';
import { createPaymentAuthorization } from '@/services/stripe';
import { toast } from "sonner";

interface PaymentFlowState {
  isProcessing: boolean;
  clientSecret: string | null;
  error: PaymentError | null;
  paymentIntentId: string | null;
}

interface PaymentFlowOptions {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: PaymentError) => void;
}

export function usePaymentFlow(options?: PaymentFlowOptions) {
  const [state, setState] = useState<PaymentFlowState>({
    isProcessing: false,
    clientSecret: null,
    error: null,
    paymentIntentId: null,
  });

  const handleError = (type: PaymentErrorType, message: string, details?: unknown) => {
    const error = createPaymentError(type, message, details);
    setState(prev => ({ ...prev, error, isProcessing: false }));
    options?.onError?.(error);
    toast.error("Payment Error", {
      description: message
    });
  };

  const initializePayment = async (amount: number, referenceId: string, productId: string) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));

      const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
        amount,
        referenceId,
        productId
      );

      if (error || !clientSecret) {
        handleError('authorization', error || 'Failed to create payment authorization');
        return false;
      }

      setState(prev => ({
        ...prev,
        clientSecret,
        paymentIntentId,
        isProcessing: false
      }));

      return true;
    } catch (err: any) {
      handleError('processing', err.message || 'An unexpected error occurred');
      return false;
    }
  };

  const reset = () => {
    setState({
      isProcessing: false,
      clientSecret: null,
      error: null,
      paymentIntentId: null,
    });
  };

  const handleSuccess = (paymentIntentId: string) => {
    options?.onSuccess?.(paymentIntentId);
    reset();
  };

  return {
    ...state,
    initializePayment,
    handleSuccess,
    reset
  };
}
