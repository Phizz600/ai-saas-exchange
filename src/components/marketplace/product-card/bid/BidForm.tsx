import { useState, useEffect } from "react";
import { useBidForm } from "./hooks/useBidForm";
import { BidDepositDialog } from "./BidDepositDialog";
import { supabase } from "@/integrations/supabase/client";
import { BidErrorAlert } from "./components/BidErrorAlert";
import { PaymentErrorAlert } from "./components/PaymentErrorAlert";
import { BidSuccessMessage } from "./components/BidSuccessMessage";
import { BidInputForm } from "./components/BidInputForm";

interface BidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function BidForm({ productId, productTitle, currentPrice }: BidFormProps) {
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [isLoadingBids, setIsLoadingBids] = useState(true);
  const [bidError, setBidError] = useState<string | null>(null);

  // Fetch the current highest bid
  useEffect(() => {
    const fetchHighestBid = async () => {
      try {
        setIsLoadingBids(true);
        const { data: product, error } = await supabase
          .from('products')
          .select('highest_bid, current_price')
          .eq('id', productId)
          .single();

        if (error) {
          console.error('Error fetching highest bid:', error);
          return;
        }

        // Set the highest bid from the database value
        setHighestBid(product.highest_bid);
        
        // Subscribe to real-time product updates to keep the price current
        const channel = supabase
          .channel('product-price-updates')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'products',
              filter: `id=eq.${productId}`
            },
            (payload: any) => {
              console.log('Product updated:', payload);
              setHighestBid(payload.new.highest_bid);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error('Error fetching bid data:', err);
      } finally {
        setIsLoadingBids(false);
      }
    };

    fetchHighestBid();
  }, [productId]);

  const {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    depositDialogOpen,
    paymentClientSecret,
    paymentError,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateBid,
    handleBidSubmit,
    resetForm
  } = useBidForm({
    productId,
    productTitle,
    currentPrice: highestBid || currentPrice
  });

  const validateAndBid = () => {
    // Clear any previous errors
    setBidError(null);
    
    const numericAmount = parseFloat(bidAmount);
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setBidError("Please enter a valid amount for your bid.");
      return;
    }

    // Validate against the current highest bid
    if (highestBid && numericAmount <= highestBid) {
      setBidError(`Your bid must be higher than the current highest bid of $${highestBid.toLocaleString()}`);
      return;
    }
    
    // If validation passes, proceed with bid
    handleInitiateBid();
  };

  const clearBidError = () => {
    if (bidError) setBidError(null);
  };

  if (success) {
    return <BidSuccessMessage resetForm={resetForm} />;
  }

  return (
    <>
      <BidErrorAlert bidError={bidError} />
      <PaymentErrorAlert paymentError={paymentError} />
      
      <BidInputForm 
        bidAmount={bidAmount}
        handleAmountChange={handleAmountChange}
        isLoadingBids={isLoadingBids}
        highestBid={highestBid}
        currentPrice={currentPrice}
        isSubmitting={isSubmitting}
        validateAndBid={validateAndBid}
        clearBidError={clearBidError}
      />

      <BidDepositDialog
        open={depositDialogOpen}
        onClose={() => setDepositDialogOpen(false)}
        onConfirm={handleBidSubmit}
        productId={productId}
        bidAmount={parseFloat(bidAmount) || 0}
        productTitle={productTitle}
        clientSecret={paymentClientSecret}
      />
    </>
  );
}
