
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

export function useStripeInitialization() {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeStripe() {
      try {
        const { data, error } = await supabase.functions.invoke('get-stripe-publishable-key');
        
        if (error) {
          console.error("Error fetching Stripe publishable key:", error);
          setError("Failed to initialize payment system");
          return;
        }
        
        if (data?.publishableKey) {
          console.log("Successfully retrieved Stripe publishable key");
          setStripePromise(loadStripe(data.publishableKey));
        } else {
          setError("Payment system configuration error");
        }
      } catch (err) {
        console.error("Exception fetching Stripe key:", err);
        setError("Payment system initialization failed");
      }
    }

    initializeStripe();
  }, []);

  return { stripePromise, error };
}
