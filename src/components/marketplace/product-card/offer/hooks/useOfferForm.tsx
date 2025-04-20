import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPaymentAuthorization } from "@/services/stripe-service";

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
  const [existingOffer, setExistingOffer] = useState<any | null>(null);
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentProcessingOpen, setPaymentProcessingOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user has an existing offer on this product
  useEffect(() => {
    const checkExistingOffer = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('product_id', productId)
          .eq('bidder_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setExistingOffer(data[0]);
          
          // Pre-fill the form with existing offer data
          setAmount(data[0].amount.toString());
          setFormattedAmount(`$${data[0].amount.toLocaleString()}`);
          
          if (data[0].message) {
            setMessage(data[0].message);
          }
          
          // If the offer is pending, enable update mode
          if (['pending'].includes(data[0].status)) {
            setIsUpdatingOffer(true);
          }
        }
      } catch (error) {
        console.error("Error checking existing offers:", error);
      }
    };
    
    checkExistingOffer();
  }, [productId]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except period
    let value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    setAmount(value);
    
    // Format for display
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
    
    // Only validate that amount is a positive number
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount for your offer.",
        variant: "destructive",
      });
      return;
    }

    // Skip minimum price validation for non-auction offers
    // For auctions, still enforce minimum price
    if (isAuction && currentPrice && numericAmount <= currentPrice) {
      toast({
        title: "Amount too low",
        description: `Your offer must be higher than the current price of $${currentPrice.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }
    
    // If updating an offer
    if (isUpdatingOffer && existingOffer) {
      await handleUpdateOffer();
    } else {
      // Create payment authorization for the offer
      await handleCreatePaymentAuthorization();
    }
  };
  
  const handleCreatePaymentAuthorization = async () => {
    try {
      setIsSubmitting(true);
      setPaymentError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to make an offer",
          variant: "destructive",
        });
        return;
      }
      
      const numericAmount = parseFloat(amount);
      
      // Create a payment authorization
      const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
        numericAmount,
        "offer-" + Date.now(), // Unique ID for this offer attempt
        productId
      );
      
      if (error || !clientSecret) {
        throw new Error(error || "Failed to create payment authorization");
      }
      
      // Store the payment information for later use
      setPaymentClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      
      // Open the payment processing dialog
      setPaymentProcessingOpen(true);
      
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      setPaymentError(error.message || "Failed to create payment");
      
      toast({
        title: "Payment initiation failed",
        description: error.message || "There was a problem setting up the payment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
      
      // Create a new offer with the payment information
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: numericAmount,
          message: message,
          status: 'pending',
          payment_intent_id: paymentIntentId,
          payment_status: 'authorized'
        })
        .select()
        .single();
      
      if (offerError) {
        throw offerError;
      }
      
      toast({
        title: "Offer submitted!",
        description: "Your offer has been submitted successfully.",
      });
      
      // Set success state
      setSuccess(true);
      setPaymentProcessingOpen(false);
      
      // Reset form
      setAmount("");
      setMessage("");
      setFormattedAmount("");
      
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
  
  const handlePaymentCancel = () => {
    setPaymentProcessingOpen(false);
    setPaymentClientSecret(null);
    setPaymentIntentId(null);
  };
  
  const handleUpdateOffer = async () => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to update your offer",
          variant: "destructive",
        });
        return;
      }
      
      const numericAmount = parseFloat(amount);
      
      // Update the offer
      const { data: updatedOffer, error: updateError } = await supabase
        .from('offers')
        .update({
          amount: numericAmount,
          message: message,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingOffer.id)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      // Success
      setSuccess(true);
      
      toast({
        title: "Offer updated!",
        description: "Your offer has been updated successfully.",
      });
      
      // Reset form
      setAmount("");
      setMessage("");
      setFormattedAmount("");
      
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
