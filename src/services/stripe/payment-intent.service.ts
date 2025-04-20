
import { supabase } from "@/integrations/supabase/client";
import { PaymentAuthorizationResponse } from "./types";

const logPaymentEvent = (event: string, details?: any) => {
  console.log(`[STRIPE-PAYMENT] ${event}`, details || '');
};

export async function createPaymentAuthorization(
  amount: number,
  bidId: string,
  productId: string
): Promise<PaymentAuthorizationResponse> {
  try {
    logPaymentEvent("Creating payment authorization", { amount, bidId });
    
    if (!amount || isNaN(amount) || amount <= 0) {
      logPaymentEvent("Invalid amount provided", { amount });
      return { 
        clientSecret: null, 
        paymentIntentId: null, 
        error: "Invalid amount provided"
      };
    }
    
    logPaymentEvent("Calling stripe-payment-intent edge function");
    
    const { data, error } = await supabase.functions.invoke('stripe-payment-intent', {
      body: {
        amount,
        bidId,
        productId,
        mode: 'authorization'
      }
    });

    if (error) {
      logPaymentEvent('Error creating payment authorization', { error });
      return { clientSecret: null, paymentIntentId: null, error: error.message };
    }

    logPaymentEvent("Payment intent created successfully", data);
    
    if (!data?.clientSecret) {
      logPaymentEvent("Missing client secret in response", { data });
      return { 
        clientSecret: null, 
        paymentIntentId: null, 
        error: "Server returned invalid response. Missing client secret."
      };
    }
    
    return { 
      clientSecret: data.clientSecret, 
      paymentIntentId: data.paymentIntentId,
      error: null 
    };
  } catch (error: any) {
    logPaymentEvent('Exception creating payment authorization', { error });
    return { 
      clientSecret: null, 
      paymentIntentId: null,
      error: error.message || 'Failed to create payment authorization' 
    };
  }
}
