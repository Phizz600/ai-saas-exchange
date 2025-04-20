
import { supabase } from "@/integrations/supabase/client";
import { PaymentResult } from "./types";

const logManagementEvent = (event: string, details?: any) => {
  console.log(`[STRIPE-MANAGEMENT] ${event}`, details || '');
};

export async function capturePaymentAuthorization(
  paymentIntentId: string
): Promise<PaymentResult> {
  try {
    logManagementEvent("Capturing payment authorization", { paymentIntentId });
    
    const { data, error } = await supabase.functions.invoke('stripe-payment-capture', {
      body: { paymentIntentId }
    });

    if (error) {
      logManagementEvent('Error capturing payment', { error });
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    logManagementEvent('Exception capturing payment', { error });
    return { success: false, error: error.message || 'Failed to capture payment' };
  }
}

export async function cancelPaymentAuthorization(
  paymentIntentId: string
): Promise<PaymentResult> {
  try {
    logManagementEvent("Canceling payment authorization", { paymentIntentId });
    
    const { data, error } = await supabase.functions.invoke('stripe-payment-cancel', {
      body: { paymentIntentId }
    });

    if (error) {
      logManagementEvent('Error canceling payment', { error });
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    logManagementEvent('Exception canceling payment', { error });
    return { success: false, error: error.message || 'Failed to cancel payment' };
  }
}
