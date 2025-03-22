
import { useState } from "react";
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
  const { toast } = useToast();

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
    
    // Open deposit dialog
    setDepositDialogOpen(true);
  };
  
  const handleOfferSubmit = async (escrowTransactionId: string) => {
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
      const depositAmount = Math.round(numericAmount * 0.1 * 100) / 100; // 10% deposit
      
      // Create the offer with deposit information
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: numericAmount,
          message: message,
          status: 'deposit_pending',
          deposit_status: 'deposit_pending',
          deposit_amount: depositAmount,
          deposit_transaction_id: escrowTransactionId
        })
        .select()
        .single();
      
      if (offerError) {
        throw offerError;
      }
      
      // Create a link between the deposit transaction and the offer
      await supabase.from('deposit_transactions').insert({
        offer_id: offer.id,
        amount: depositAmount,
        escrow_transaction_id: escrowTransactionId,
        status: 'pending'
      });
      
      // Success
      setSuccess(true);
      
      toast({
        title: "Offer initiated!",
        description: "Once your deposit is confirmed, your offer will be submitted to the seller.",
      });
      
      // Reset form
      setAmount("");
      setMessage("");
      setFormattedAmount("");
      
    } catch (error: any) {
      console.error("Error creating offer:", error);
      
      toast({
        title: "Failed to create offer",
        description: error.message || "An error occurred while creating your offer.",
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
    setAmount,
    setMessage,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateOffer,
    handleOfferSubmit,
    resetForm
  };
}
