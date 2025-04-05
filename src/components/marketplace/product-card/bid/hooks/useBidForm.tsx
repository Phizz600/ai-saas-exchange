import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPaymentAuthorization } from "@/services/stripe-service";

interface UseBidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function useBidForm({ productId, productTitle, currentPrice }: UseBidFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [formattedBidAmount, setFormattedBidAmount] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [bidId, setBidId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Format the amount as currency
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.replace(/\./g, (match, index, string) => {
        return index === string.indexOf('.') ? '.' : '';
      });
    }
    
    // Limit to 2 decimal places
    if (value.includes('.')) {
      const parts = value.split('.');
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    
    setBidAmount(value);
    
    // Format for display
    if (value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setFormattedBidAmount(`$${numericValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      } else {
        setFormattedBidAmount("");
      }
    } else {
      setFormattedBidAmount("");
    }
  };

  // First step: Create bid and prepare payment
  const handleInitiateBid = async () => {
    try {
      setIsSubmitting(true);
      setPaymentError(null);
      
      // Validate amount
      const amount = parseFloat(bidAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid bid amount",
          variant: "destructive"
        });
        return;
      }

      // Validate against current price - only against authorized highest bid or system price
      if (currentPrice && amount <= currentPrice) {
        toast({
          title: "Bid too low",
          description: `Your bid must be higher than the current price of $${currentPrice.toLocaleString()}`,
          variant: "destructive"
        });
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to place a bid",
          variant: "destructive"
        });
        return;
      }

      console.log(`Creating bid for product ${productId} with amount ${amount}`);

      // Create a pending bid in the database
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (bidError) {
        console.error('Error creating bid:', bidError);
        toast({
          title: "Bid creation failed",
          description: bidError.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Bid created successfully:', bid);
      setBidId(bid.id);

      // Create payment authorization
      console.log(`Creating payment authorization for amount: ${amount}, bidId: ${bid.id}`);
      const { clientSecret, paymentIntentId, error } = await createPaymentAuthorization(
        amount,
        bid.id,
        productId
      );

      if (error || !clientSecret) {
        console.error('Payment authorization error:', error);
        setPaymentError(error || "Failed to create payment authorization");
        toast({
          title: "Payment setup failed",
          description: error || "There was an error setting up the payment. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Payment authorization created successfully with client secret');
      
      // Store the client secret for the payment form
      setPaymentClientSecret(clientSecret);
      
      // Open the payment dialog
      setDepositDialogOpen(true);
      
    } catch (err: any) {
      console.error('Error initiating bid:', err);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Second step: After payment method is confirmed
  const handleBidSubmit = async (paymentIntentId: string) => {
    try {
      setIsSubmitting(true);
      
      if (!bidId) {
        throw new Error("Missing bid information");
      }
      
      console.log(`Updating bid ${bidId} with payment intent ${paymentIntentId}`);
      
      // Update the bid with the payment status and intent ID
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
      
      console.log('Bid updated successfully with payment information');
      
      // Now update the highest bid on the product through our edge function
      const { data: bidData, error: bidFetchError } = await supabase
        .from('bids')
        .select('amount, bidder_id')
        .eq('id', bidId)
        .single();
        
      if (bidFetchError) {
        throw new Error(`Failed to get bid details: ${bidFetchError.message}`);
      }
      
      console.log('Updating highest bid on product with edge function');
      
      // Call the update-highest-bid edge function
      const { data: updateResult, error: highestBidError } = await supabase.functions.invoke(
        'update-highest-bid',
        {
          body: {
            productId: productId,
            bidAmount: bidData.amount,
            bidderId: bidData.bidder_id
          }
        }
      );
      
      if (highestBidError) {
        console.error('Error updating highest bid:', highestBidError);
        // Don't throw here, as the bid is already placed
      } else {
        console.log('Result from update-highest-bid function:', updateResult);
        if (!updateResult.success) {
          console.warn('Bid not set as highest bid:', updateResult.message);
        }
      }
      
      // Show success message
      toast({
        title: "Bid placed successfully!",
        description: `Your bid of $${parseFloat(bidAmount).toLocaleString()} has been placed and your payment method has been authorized.`,
      });
      
      // Close the deposit dialog and show success state
      setDepositDialogOpen(false);
      setSuccess(true);
      
    } catch (err: any) {
      console.error('Error submitting bid:', err);
      setPaymentError(err.message || "Failed to complete bid submission");
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // When dialog is closed without completion or payment is cancelled
  const handleBidCancellation = async () => {
    try {
      if (!bidId) {
        return;
      }
      
      console.log(`Cancelling bid ${bidId} due to payment cancellation`);
      
      // Mark the bid as cancelled in the database
      const { error: updateError } = await supabase
        .from('bids')
        .update({
          status: 'cancelled',
          payment_status: 'cancelled'
        })
        .eq('id', bidId);
        
      if (updateError) {
        console.error(`Failed to update bid as cancelled: ${updateError.message}`);
      } else {
        console.log(`Bid ${bidId} successfully marked as cancelled`);
      }
    } catch (err) {
      console.error('Error cancelling bid:', err);
    }
  };
  
  const resetForm = () => {
    setBidAmount("");
    setFormattedBidAmount("");
    setSuccess(false);
    setPaymentClientSecret(null);
    setPaymentError(null);
    setBidId(null);
  };
  
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
