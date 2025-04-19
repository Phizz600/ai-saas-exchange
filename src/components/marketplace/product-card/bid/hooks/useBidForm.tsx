
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
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

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

    const newBidId = await createBid(amount);
    if (newBidId) {
      const paymentInitialized = await initializePayment(amount, newBidId);
      if (paymentInitialized) {
        setDepositDialogOpen(true);
      }
    }
  };

  const handleBidSubmit = async (paymentIntentId: string) => {
    try {
      if (!bidId) {
        throw new Error("Missing bid information");
      }
      
      console.log(`Updating bid ${bidId} with payment intent ${paymentIntentId}`);
      
      const { error: updateError } = await supabase
        .from('bids')
        .update({
          payment_intent_id: paymentIntentId,
          payment_status: 'authorized',
          status: 'active'
        })
        .eq('id', bidId);
        
      if (updateError) {
        throw new Error(`Failed to update bid: ${updateError.message}`);
      }
      
      toast.success("Bid placed successfully!", {
        description: `Your bid of $${parseFloat(bidAmount).toLocaleString()} has been placed.`
      });
      
      setDepositDialogOpen(false);
      setSuccess(true);
      
    } catch (err: any) {
      console.error('Error submitting bid:', err);
      if (onValidationError) {
        onValidationError(err.message || "Failed to complete bid submission");
      }
      toast.error("Error", {
        description: err.message || "An unexpected error occurred"
      });
    }
  };

  const handleBidCancellation = async () => {
    if (!bidId) return;
    
    try {
      console.log(`Cancelling bid ${bidId} due to payment cancellation`);
      
      const { error: updateError } = await supabase
        .from('bids')
        .update({
          status: 'cancelled',
          payment_status: 'cancelled'
        })
        .eq('id', bidId);
        
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

  const isSubmitting = isCreatingBid || isProcessingPayment;

  return {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    depositDialogOpen,
    paymentClientSecret,
    paymentError,
    bidId,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateBid,
    handleBidSubmit,
    handleBidCancellation,
    resetForm
  };
}
