import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("");
  const [existingOffer, setExistingOffer] = useState<any | null>(null);
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);
  const [additionalDepositAmount, setAdditionalDepositAmount] = useState(0);
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
          
          // If the offer is pending or deposit_pending, enable update mode
          if (['pending', 'deposit_pending'].includes(data[0].status)) {
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
        
        // Calculate additional deposit needed for updates
        if (isUpdatingOffer && existingOffer) {
          const originalAmount = existingOffer.amount;
          const originalDeposit = existingOffer.deposit_amount;
          
          if (numericValue > originalAmount * 1.2) {
            const newDepositTotal = Math.round(numericValue * 0.1 * 100) / 100;
            const additionalDepositNeeded = Math.round((newDepositTotal - originalDeposit) * 100) / 100;
            setAdditionalDepositAmount(additionalDepositNeeded > 0 ? additionalDepositNeeded : 0);
          } else {
            setAdditionalDepositAmount(0);
          }
        }
      } else {
        setFormattedAmount("");
      }
    } else {
      setFormattedAmount("");
    }
  };

  const handleInitiateOffer = async () => {
    const numericAmount = parseFloat(amount);
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount for your offer.",
        variant: "destructive",
      });
      return;
    }

    // For auction listings, validate against the current price
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
      // Only require deposit if increasing by more than 20%
      if (numericAmount > existingOffer.amount * 1.2 && additionalDepositAmount > 0) {
        // Open deposit dialog with additional deposit amount
        setDepositDialogOpen(true);
      } else {
        // Just update the offer without additional deposit
        await handleUpdateOffer();
      }
    } else {
      // Open deposit dialog for new offer
      setDepositDialogOpen(true);
    }
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
  
  const handleOfferSubmit = async (paymentIntentId: string) => {
    try {
      setIsSubmitting(true);
      
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
      
      // If updating an existing offer with additional deposit
      if (isUpdatingOffer && existingOffer) {
        // Calculate new deposit total (original + additional)
        const newDepositTotal = existingOffer.deposit_amount + additionalDepositAmount;
        
        // Update the existing offer
        const { data: updatedOffer, error: updateError } = await supabase
          .from('offers')
          .update({
            amount: numericAmount,
            message: message,
            deposit_amount: newDepositTotal,
            payment_intent_id: paymentIntentId,
            payment_status: 'authorized',
            payment_amount: additionalDepositAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingOffer.id)
          .select()
          .single();
        
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Offer updated!",
          description: "Your offer has been updated with the additional deposit.",
        });
      } else {
        // Create a new offer for first-time offers
        const depositAmount = Math.round(numericAmount * 0.1 * 100) / 100; // 10% deposit
        
        const { data: offer, error: offerError } = await supabase
          .from('offers')
          .insert({
            product_id: productId,
            bidder_id: user.id,
            amount: numericAmount,
            message: message,
            status: 'pending',
            deposit_status: 'deposit_pending',
            deposit_amount: depositAmount,
            payment_intent_id: paymentIntentId,
            payment_status: 'authorized',
            payment_amount: depositAmount
          })
          .select()
          .single();
        
        if (offerError) {
          throw offerError;
        }
        
        toast({
          title: "Offer submitted!",
          description: "Your offer has been submitted with the deposit authorization.",
        });
      }
      
      // Set success state
      setSuccess(true);
      
      // Reset form
      setAmount("");
      setMessage("");
      setFormattedAmount("");
      
    } catch (error: any) {
      console.error("Error creating/updating offer:", error);
      
      toast({
        title: "Failed to process offer",
        description: error.message || "An error occurred while processing your offer.",
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
    depositDialogOpen,
    formattedAmount,
    existingOffer,
    isUpdatingOffer,
    additionalDepositAmount,
    setAmount,
    setMessage,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateOffer,
    handleOfferSubmit,
    handleUpdateOffer,
    resetForm
  };
}
