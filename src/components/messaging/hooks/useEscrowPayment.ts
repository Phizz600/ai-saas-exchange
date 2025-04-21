
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { addPaymentReceiptMessage, updateEscrowStatus } from "@/integrations/supabase/escrow";
import { createPaymentAuthorization } from "@/services/stripe";
import { supabase } from "@/integrations/supabase/client";

interface UseEscrowPaymentOptions {
  transaction: any;
  onStatusChange: () => void;
  onClose: () => void;
}

type Step = "agreement" | "payment" | "success" | "error";

export function useEscrowPayment({
  transaction,
  onStatusChange,
  onClose
}: UseEscrowPaymentOptions) {
  const [step, setStep] = useState<Step>("agreement");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<null | string>(null);

  const payNow = async () => {
    setError(null);
    setStep("payment");
    setIsLoading(true);
    try {
      const reference = `escrow-${transaction.id}`;
      const amount = transaction.amount + transaction.platform_fee + transaction.escrow_fee;

      // Call createPaymentAuthorization to create payment intent
      const { clientSecret, paymentIntentId, error: authError } =
        await createPaymentAuthorization(amount, reference, transaction.product_id);

      if (authError || !clientSecret) {
        setError(authError || "Unable to create payment intent.");
        setStep("error");
        setIsLoading(false);
        return;
      }

      // Immediately confirm the payment, using Stripe (since this function runs in the dialog)
      // Here you should use Stripe.js directly, but for initial demo we'll pretend the payment succeeded
      // Production: Use <Elements> + <PaymentElement> UI for card entry/payment

      // Simulate auto-payment for workflow (developers should replace this)
      // Mark payment as secured in escrow transaction
      await updateEscrowStatus(transaction.id, "payment_secured");
      setPaymentStatus("payment_secured");

      // Add a system message for payment receipt
      await addPaymentReceiptMessage(
        transaction.conversation_id,
        transaction.id,
        paymentIntentId || clientSecret,
        amount
      );

      toast({
        title: "Escrow payment secured",
        description: "Funds were successfully deposited in escrow and both parties notified.",
      });
      setStep("success");
      onStatusChange?.();
    } catch (err: any) {
      setError(err?.message || "Payment failed.");
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsLoading(false);
    setPaymentStatus(null);
    setStep("agreement");
  };

  return {
    step,
    payNow,
    isLoading,
    error,
    paymentStatus,
    reset
  };
}
