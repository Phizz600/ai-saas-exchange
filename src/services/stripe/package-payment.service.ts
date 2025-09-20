import { supabase } from "@/integrations/supabase/client";
import { PaymentAuthorizationResponse } from "./types";

export async function createPackagePayment(
  packageType: 'featured-listing' | 'premium-exit'
): Promise<PaymentAuthorizationResponse> {
  try {
    console.log(`Creating package payment for: ${packageType}`);
    
    const { data, error } = await supabase.functions.invoke('create-package-payment', {
      body: { packageType }
    });
    
    if (error) {
      console.error('Error calling create-package-payment function:', error);
      return {
        clientSecret: null,
        paymentIntentId: null,
        error: error.message || 'Failed to create package payment'
      };
    }
    
    if (!data?.clientSecret) {
      console.error('No client secret returned from create-package-payment');
      return {
        clientSecret: null,
        paymentIntentId: null,
        error: 'Payment setup failed'
      };
    }
    
    console.log('Package payment created successfully');
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
      error: null
    };
  } catch (error: any) {
    console.error('Exception in createPackagePayment:', error);
    return {
      clientSecret: null,
      paymentIntentId: null,
      error: error.message || 'Payment setup failed'
    };
  }
}

export async function recordPackagePurchase(
  packageType: string,
  amount: number,
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Define package benefits
    const packageBenefits = {
      'free-listing': {
        reducedFees: false,
        newsletter: false,
        playbook: false,
        checklist: false,
        salesRep: false,
        ama: false,
        strategyCall: false,
        priority: false
      },
      'featured-listing': {
        reducedFees: true,
        newsletter: true,
        playbook: true,
        checklist: true,
        salesRep: false,
        ama: false,
        strategyCall: false,
        priority: false
      },
      'premium-exit': {
        reducedFees: true,
        newsletter: true,
        playbook: true,
        checklist: true,
        salesRep: true,
        ama: true,
        strategyCall: true,
        priority: true
      }
    };

    const { error } = await supabase
      .from('package_purchases')
      .insert({
        user_id: user.id,
        package_type: packageType,
        amount: amount,
        payment_intent_id: paymentIntentId,
        payment_status: 'succeeded',
        benefits: packageBenefits[packageType as keyof typeof packageBenefits] || {}
      });

    if (error) {
      console.error('Error recording package purchase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception in recordPackagePurchase:', error);
    return { success: false, error: error.message || 'Failed to record purchase' };
  }
}