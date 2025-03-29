
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Validate amount - moved to BidForm component
    // We'll still have a basic check here as a fallback
    if (isNaN(numericAmount) || numericAmount <= 0 || (currentPrice && numericAmount <= currentPrice)) {
      return;
    }
    
    // Open deposit dialog
    setDepositDialogOpen(true);
  };

  const handleBidSubmit = async (escrowTransactionId: string) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to place a bid",
          variant: "destructive",
        });
        return;
      }
      
      const numericAmount = parseFloat(bidAmount);
      const depositAmount = Math.round(numericAmount * 0.1 * 100) / 100; // 10% deposit
      
      // Create a new bid
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: numericAmount,
          status: escrowTransactionId === "manual" ? 'deposit_pending_manual' : 'deposit_pending',
          deposit_status: 'pending',
          deposit_amount: depositAmount
        })
        .select()
        .single();
      
      if (bidError) {
        console.error('Error creating bid:', bidError);
        throw bidError;
      }
      
      // Create a deposit_transactions record
      if (escrowTransactionId !== "manual") {
        const { error: depositError } = await supabase.from('deposit_transactions').insert({
          bid_id: bid.id,
          amount: depositAmount,
          escrow_transaction_id: escrowTransactionId,
          status: 'pending'
        });
        
        if (depositError) {
          console.error('Error creating deposit transaction:', depositError);
          throw depositError;
        }
      }
      
      toast({
        title: "Bid submitted!",
        description: escrowTransactionId === "manual" 
          ? "Your bid has been submitted. Please contact support to complete the deposit manually."
          : "Once your deposit is confirmed, your bid will be processed.",
      });
      
      // Set success state
      setSuccess(true);
      
      // Reset form
      setBidAmount("");
      setFormattedBidAmount("");
      
    } catch (error: any) {
      console.error("Error creating bid:", error);
      
      toast({
        title: "Failed to process bid",
        description: error.message || "An error occurred while processing your bid.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBidAmount("");
    setFormattedBidAmount("");
    setSuccess(false);
  };

  return {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    depositDialogOpen,
    setBidAmount,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateBid,
    handleBidSubmit,
    resetForm
  };
}
