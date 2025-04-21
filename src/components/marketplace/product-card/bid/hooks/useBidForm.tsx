
import { useState } from "react";
import { useBidAmountFormat } from "./useBidAmountFormat";
import { useBidCreation } from "./useBidCreation";
import { usePaymentProcessing } from "./usePaymentProcessing";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseBidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
  onValidationError?: (error: string) => void;
}

export function useBidForm({ 
  productId, 
  productTitle, 
  currentPrice, 
  onValidationError 
}: UseBidFormProps) {
  const [success, setSuccess] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const {
    bidAmount,
    formattedBidAmount,
    handleAmountChange,
    resetAmount
  } = useBidAmountFormat();

  const {
    createBid,
    isCreatingBid,
    bidId
  } = useBidCreation({ 
    productId, 
    onValidationError 
  });

  const {
    initializePayment,
    resetPayment,
    isProcessingPayment,
    paymentClientSecret,
    paymentError
  } = usePaymentProcessing({ 
    productId,
    onSuccess: () => setSuccess(true)
  });

  const handleInitiateBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      if (onValidationError) {
        onValidationError("Please enter a valid bid amount");
      }
      return;
    }

    try {
      setIsPaymentProcessing(true);
      
      // Create the bid
      const newBidId = await createBid(amount);
      if (!newBidId) {
        throw new Error("Failed to create bid");
      }
      
      // Initialize payment directly - no deposit dialog needed
      const paymentInitialized = await initializePayment(amount, newBidId);
      
      if (!paymentInitialized) {
        throw new Error("Failed to initialize payment");
      }
      
      // On successful payment authorization, update the bid
      await handleBidSuccess(newBidId, amount);
      
    } catch (err: any) {
      console.error('Error in bid process:', err);
      if (onValidationError) {
        onValidationError(err.message || "An error occurred during the bidding process");
      }
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleBidSuccess = async (bidId: string, amount: number) => {
    try {
      console.log(`Updating bid ${bidId} as successful`);
      
      const { error: updateError } = await supabase
        .from('bids')
        .update({
          payment_status: 'authorized',
          status: 'active'
        })
        .eq('id', bidId);
        
      if (updateError) {
        throw new Error(`Failed to update bid: ${updateError.message}`);
      }
      
      toast.success("Bid placed successfully!", {
        description: `Your bid of $${amount.toLocaleString()} has been placed.`
      });
      
      setSuccess(true);
      
    } catch (err: any) {
      console.error('Error submitting bid:', err);
      if (onValidationError) {
        onValidationError(err.message || "Failed to complete bid submission");
      }
      
      // Cancel the bid if updating fails
      handleBidCancellation(bidId);
      
      toast.error("Error", {
        description: err.message || "An unexpected error occurred"
      });
    }
  };

  const handleBidCancellation = async (bidToCancel?: string) => {
    const idToCancel = bidToCancel || bidId;
    if (!idToCancel) return;
    
    try {
      console.log(`Cancelling bid ${idToCancel}`);
      
      const { error: updateError } = await supabase
        .from('bids')
        .update({
          status: 'cancelled',
          payment_status: 'cancelled'
        })
        .eq('id', idToCancel);
        
      if (updateError) {
        console.error(`Failed to update bid as cancelled: ${updateError.message}`);
      }
    } catch (err) {
      console.error('Error cancelling bid:', err);
    }
  };

  const resetForm = () => {
    resetAmount();
    resetPayment();
    setSuccess(false);
  };

  const isSubmitting = isCreatingBid || isProcessingPayment || isPaymentProcessing;

  return {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    paymentClientSecret,
    paymentError,
    bidId,
    handleAmountChange,
    handleInitiateBid,
    handleBidCancellation,
    resetForm
  };
}
