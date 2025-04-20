
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOfferPayment } from "./useOfferPayment";
import { useExistingOffer } from "./useExistingOffer";
import { submitNewOffer, updateExistingOffer } from "../services/offerSubmission";

interface UseOfferFormProps {
  productId: string;
  isAuction?: boolean;
  currentPrice?: number;
}

export function useOfferForm({ productId, isAuction, currentPrice = 0 }: UseOfferFormProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("");
  const { toast } = useToast();

  const {
    existingOffer,
    isUpdatingOffer
  } = useExistingOffer(productId);

  const {
    paymentClientSecret,
    paymentIntentId,
    paymentProcessingOpen,
    paymentError,
    handleCreatePaymentAuthorization,
    handlePaymentCancel
  } = useOfferPayment({ productId });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    setAmount(value);
    
    if (value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setFormattedAmount(`$${numericValue.toLocaleString()}`);
      } else {
        setFormattedAmount("");
      }
    } else {
      setFormattedAmount("");
    }
  };

  const handleInitiateOffer = async () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount for your offer.",
        variant: "destructive",
      });
      return;
    }

    if (isUpdatingOffer && existingOffer) {
      await handleUpdateOffer();
    } else {
      await handleCreatePaymentAuthorization(numericAmount);
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to complete your offer",
          variant: "destructive",
        });
        return;
      }
      
      const numericAmount = parseFloat(amount);
      
      await submitNewOffer(
        productId,
        user.id,
        numericAmount,
        message,
        paymentIntentId!
      );
      
      toast({
        title: "Offer submitted!",
        description: "Your offer has been submitted successfully.",
      });
      
      setSuccess(true);
      setPaymentProcessingOpen(false);
      resetForm();
      
    } catch (error: any) {
      console.error("Error creating offer:", error);
      
      toast({
        title: "Failed to process offer",
        description: error.message || "An error occurred while processing your offer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateOffer = async () => {
    try {
      setIsSubmitting(true);
      
      const numericAmount = parseFloat(amount);
      
      await updateExistingOffer(
        existingOffer.id,
        numericAmount,
        message
      );
      
      setSuccess(true);
      
      toast({
        title: "Offer updated!",
        description: "Your offer has been updated successfully.",
      });
      
      resetForm();
      
    } catch (error: any) {
      console.error("Error updating offer:", error);
      
      toast({
        title: "Failed to update offer",
        description: error.message || "An error occurred while updating your offer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setMessage("");
    setFormattedAmount("");
    setSuccess(false);
  };

  return {
    amount,
    message,
    isSubmitting,
    success,
    formattedAmount,
    existingOffer,
    isUpdatingOffer,
    paymentClientSecret,
    paymentProcessingOpen,
    paymentError,
    setAmount,
    setMessage,
    handleAmountChange,
    handleInitiateOffer,
    handlePaymentSuccess,
    handlePaymentCancel,
    resetForm
  };
}
