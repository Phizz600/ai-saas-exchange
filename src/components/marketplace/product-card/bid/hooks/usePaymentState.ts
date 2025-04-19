
import { useState } from 'react';

interface PaymentState {
  isProcessing: boolean;
  error: string | null;
  isSuccess: boolean;
}

export function usePaymentState() {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    error: null,
    isSuccess: false
  });

  const startProcessing = () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
  };

  const setError = (error: string) => {
    setState(prev => ({ ...prev, isProcessing: false, error }));
  };

  const setSuccess = () => {
    setState({ isProcessing: false, error: null, isSuccess: true });
  };

  const reset = () => {
    setState({ isProcessing: false, error: null, isSuccess: false });
  };

  return {
    ...state,
    startProcessing,
    setError,
    setSuccess,
    reset
  };
}
