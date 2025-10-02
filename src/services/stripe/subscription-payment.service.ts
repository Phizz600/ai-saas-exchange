import { supabase } from "@/integrations/supabase/client";
import { PaymentAuthorizationResponse } from "./types";

const logSubscriptionEvent = (event: string, details?: any) => {
  console.log(`[STRIPE-SUBSCRIPTION] ${event}`, details || '');
};

export async function createMarketplaceSubscription(): Promise<PaymentAuthorizationResponse> {
  try {
    logSubscriptionEvent("Creating marketplace subscription");
    
    const { data, error } = await supabase.functions.invoke('create-marketplace-subscription', {
      body: {}
    });

    if (error) {
      logSubscriptionEvent('Error creating subscription', { error });
      return { clientSecret: null, paymentIntentId: null, error: error.message };
    }

    logSubscriptionEvent("Subscription created successfully", data);
    
    if (!data?.clientSecret) {
      logSubscriptionEvent("Missing client secret in response", { data });
      return { 
        clientSecret: null, 
        paymentIntentId: null, 
        error: "Server returned invalid response. Missing client secret."
      };
    }
    
    return { 
      clientSecret: data.clientSecret, 
      paymentIntentId: data.subscriptionId || data.paymentIntentId,
      error: null 
    };
  } catch (error: any) {
    logSubscriptionEvent('Exception creating subscription', { error });
    return { 
      clientSecret: null, 
      paymentIntentId: null,
      error: error.message || 'Failed to create subscription' 
    };
  }
}

export async function recordMarketplaceSubscription(
  subscriptionId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    logSubscriptionEvent("Recording marketplace subscription", { subscriptionId, amount });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Record in profiles that user has marketplace access
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        has_marketplace_access: true,
        marketplace_subscription_id: subscriptionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (profileError) {
      logSubscriptionEvent("Error updating profile", { error: profileError });
      return { success: false, error: profileError.message };
    }

    logSubscriptionEvent("Subscription recorded successfully");
    return { success: true };
    
  } catch (error: any) {
    logSubscriptionEvent("Exception recording subscription", { error });
    return { success: false, error: error.message };
  }
}
