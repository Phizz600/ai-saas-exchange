
import { useState } from "react";

interface PaymentState {
  clientSecret: string | null;
  paymentIntentId: string | null;
  isLoading: boolean;
}

export function usePaymentState() {
  const [state, setState] = useState<PaymentState>({
    clientSecret: null,
    paymentIntentId: null,
    isLoading: false
  });

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setPaymentDetails = (clientSecret: string, paymentIntentId: string) => {
    setState(prev => ({
      ...prev,
      clientSecret,
      paymentIntentId
    }));
  };

  const reset = () => {
    setState({
      clientSecret: null,
      paymentIntentId: null,
      isLoading: false
    });
  };

  return {
    ...state,
    setLoading,
    setPaymentDetails,
    reset
  };
}
