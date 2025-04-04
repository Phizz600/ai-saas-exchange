
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPaymentAuthorization } from "@/services/stripe-service";

interface UseBidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function useBidForm({ productId, productTitle, currentPrice = 0 }: UseBidFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [formattedBidAmount, setFormattedBidAmount] = useState("");
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [bidId, setBidId] = useState<string | null>(null);
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
    
    setBidAmount(value);
    
    // Format for display
    if (value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setFormattedBidAmount(`$${numericValue.toLocaleString()}`);
      } else {
        setFormattedBidAmount("");
      }
    } else {
      setFormattedBidAmount("");
    }
  };

  const handleInitiateBid = async () => {
    const numericAmount = parseFloat(bidAmount);
    
    // Basic validation (more validation in the UI component)
    if (isNaN(numericAmount) || numericAmount <= 0 || (currentPrice && numericAmount <= currentPrice)) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 1. Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to place a bid",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // 2. Create a bid record with pending status
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: numericAmount,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();
        
      if (bidError) {
        console.error("Error creating bid:", bidError);
        toast({
          title: "Bid Error",
          description: "Failed to place your bid. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Store the bid ID for use in payment processing
      setBidId(bid.id);
      
      // 3. Create a payment authorization with Stripe
      const { clientSecret, error: stripeError } = await createPaymentAuthorization(
        numericAmount, 
        bid.id,
        productId
      );
      
      if (stripeError || !clientSecret) {
        console.error("Stripe authorization error:", stripeError);
        toast({
          title: "Payment Authorization Error",
          description: stripeError || "Failed to create payment authorization. Please try again.",
          variant: "destructive",
        });
        
        // Clean up the bid record
        await supabase
          .from('bids')
          .delete()
          .eq('id', bid.id);
          
        setIsSubmitting(false);
        return;
      }
      
      // Store the client secret for use in the payment form
      setPaymentClientSecret(clientSecret);
      
      // 4. Open the deposit dialog to complete payment
      setDepositDialogOpen(true);
      
    } catch (error) {
      console.error("Error initiating bid:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBidSubmit = async (paymentMethodId: string) => {
    try {
      setIsSubmitting(true);
      
      if (!bidId) {
        throw new Error("Bid ID is missing");
      }
      
      // Update the bid record with the payment method ID
      const { error: updateError } = await supabase
        .from('bids')
        .update({ 
          payment_method_id: paymentMethodId,
          status: 'active',
          payment_status: 'processing'
        })
        .eq('id', bidId);
        
      if (updateError) {
        throw updateError;
      }
      
      // Show success message
      setSuccess(true);
      
      toast({
        title: "Bid Placed Successfully",
        description: "Your bid has been placed and your payment method has been authorized.",
      });
      
      // Reset the form
      setBidAmount("");
      setFormattedBidAmount("");
      
    } catch (error: any) {
      console.error("Error finalizing bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete your bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDepositDialogOpen(false);
    }
  };

  const resetForm = () => {
    setBidAmount("");
    setFormattedBidAmount("");
    setSuccess(false);
    setBidId(null);
    setPaymentClientSecret(null);
  };

  return {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    depositDialogOpen,
    paymentClientSecret,
    bidId,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateBid,
    handleBidSubmit,
    resetForm
  };
}
