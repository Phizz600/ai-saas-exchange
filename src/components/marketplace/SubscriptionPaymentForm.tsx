import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/CleanAuthContext";
import { Loader2 } from "lucide-react";

interface SubscriptionPaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SubscriptionPaymentForm({ onSuccess, onCancel }: SubscriptionPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createSubscription = async () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    try {
      setIsProcessing(true);
      
      // Call edge function to create subscription
      const { data, error } = await supabase.functions.invoke('create-marketplace-subscription', {
        body: {
          userId: user.id,
          priceId: 'price_marketplace_monthly', // Your Stripe price ID
          amount: 4995, // $49.95 in cents
        }
      });

      if (error) {
        console.error('Subscription creation error:', error);
        toast.error("Failed to create subscription");
        return;
      }

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      if (!clientSecret) {
        await createSubscription();
        return;
      }
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/marketplace?subscription=success`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        toast.error(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {clientSecret ? (
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      ) : (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Click below to initialize secure payment</p>
        </div>
      )}
      
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {clientSecret ? 'Processing...' : 'Setting up...'}
            </>
          ) : (
            clientSecret ? 'Subscribe Now' : 'Initialize Payment'
          )}
        </Button>
      </div>
    </form>
  );
}