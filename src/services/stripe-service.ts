
import { supabase } from "@/integrations/supabase/client";

// Function to create a payment intent in authorization-only mode
export async function createPaymentAuthorization(
  amount: number,
  bidId: string,
  productId: string
): Promise<{ clientSecret: string | null; paymentIntentId: string | null; error: string | null }> {
  try {
    // Call our edge function to create a payment intent
    const { data, error } = await supabase.functions.invoke('stripe-payment-intent', {
      body: {
        amount,
        bidId,
        productId,
        mode: 'authorization'
      }
    });

    if (error) {
      console.error('Error creating payment authorization:', error);
      return { clientSecret: null, paymentIntentId: null, error: error.message };
    }

    return { 
      clientSecret: data.clientSecret, 
      paymentIntentId: data.paymentIntentId,
      error: null 
    };
  } catch (error: any) {
    console.error('Exception creating payment authorization:', error);
    return { 
      clientSecret: null, 
      paymentIntentId: null,
      error: error.message || 'Failed to create payment authorization' 
    };
  }
}

// Function to capture an authorized payment
export async function capturePaymentAuthorization(
  paymentIntentId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-payment-capture', {
      body: {
        paymentIntentId
      }
    });

    if (error) {
      console.error('Error capturing payment:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      error: null 
    };
  } catch (error: any) {
    console.error('Exception capturing payment:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to capture payment' 
    };
  }
}

// Function to cancel a payment authorization
export async function cancelPaymentAuthorization(
  paymentIntentId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-payment-cancel', {
      body: {
        paymentIntentId
      }
    });

    if (error) {
      console.error('Error canceling payment:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      error: null 
    };
  } catch (error: any) {
    console.error('Exception canceling payment:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to cancel payment' 
    };
  }
}
