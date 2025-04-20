
import { supabase } from "@/integrations/supabase/client";
import { PaymentVerificationResponse } from "./types";

const logVerificationEvent = (event: string, details?: any) => {
  console.log(`[STRIPE-VERIFICATION] ${event}`, details || '');
};

export async function verifyPaymentIntent(
  paymentIntentId: string
): Promise<PaymentVerificationResponse> {
  try {
    logVerificationEvent("Verifying payment intent", { paymentIntentId });
    
    if (!paymentIntentId) {
      logVerificationEvent("Missing payment intent ID");
      return {
        status: null,
        success: false,
        error: "Missing payment intent ID"
      };
    }
    
    const { data, error } = await supabase.functions.invoke('stripe-payment-verify', {
      body: { paymentIntentId }
    });

    if (error) {
      logVerificationEvent('Error verifying payment intent', { error });
      return { 
        status: null,
        success: false, 
        error: error.message 
      };
    }

    logVerificationEvent("Payment intent verified", data);
    
    return { 
      status: data?.status || null,
      amount: data?.amount,
      metadata: data?.metadata,
      success: true, 
      error: null 
    };
  } catch (error: any) {
    logVerificationEvent('Exception verifying payment intent', { error });
    return { 
      status: null,
      success: false, 
      error: error.message || 'Failed to verify payment intent' 
    };
  }
}
