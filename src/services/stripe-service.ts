
import { supabase } from "@/integrations/supabase/client";

// Function to create a payment intent in authorization-only mode
export async function createPaymentAuthorization(
  amount: number,
  bidId: string,
  productId: string
): Promise<{ clientSecret: string | null; paymentIntentId: string | null; error: string | null }> {
  try {
    console.log("Creating payment authorization for amount:", amount, "bidId:", bidId);
    
    // Ensure amount is valid
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error("Invalid amount provided for payment authorization:", amount);
      return { 
        clientSecret: null, 
        paymentIntentId: null, 
        error: "Invalid amount provided"
      };
    }
    
    console.log("Calling stripe-payment-intent edge function");
    
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

    console.log("Payment intent created successfully:", data);
    
    if (!data?.clientSecret) {
      console.error("Missing client secret in response:", data);
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

// Function to verify a payment intent status
export async function verifyPaymentIntent(
  paymentIntentId: string
): Promise<{ status: string | null; success: boolean; error: string | null; amount?: number; metadata?: Record<string, any> }> {
  try {
    console.log("Verifying payment intent:", paymentIntentId);
    
    if (!paymentIntentId) {
      console.error("Missing payment intent ID for verification");
      return {
        status: null,
        success: false,
        error: "Missing payment intent ID"
      };
    }
    
    const { data, error } = await supabase.functions.invoke('stripe-payment-verify', {
      body: {
        paymentIntentId
      }
    });

    if (error) {
      console.error('Error verifying payment intent:', error);
      return { 
        status: null,
        success: false, 
        error: error.message 
      };
    }

    console.log("Payment intent verified:", data);
    
    return { 
      status: data?.status || null,
      amount: data?.amount,
      metadata: data?.metadata,
      success: true, 
      error: null 
    };
  } catch (error: any) {
    console.error('Exception verifying payment intent:', error);
    return { 
      status: null,
      success: false, 
      error: error.message || 'Failed to verify payment intent' 
    };
  }
}

// Function to track a payment status and handle webhook events
export async function registerPaymentHook(
  paymentIntentId: string,
  callbackUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    console.log("Registering payment hook for:", paymentIntentId);
    
    // Store the callback URL in your database or cache
    // This is where Stripe would notify your app about payment status changes
    
    return { 
      success: true, 
      error: null 
    };
  } catch (error: any) {
    console.error('Exception registering payment hook:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to register payment hook' 
    };
  }
}
