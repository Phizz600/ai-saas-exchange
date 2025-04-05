import { useState, useEffect } from "react";
import { useBidForm } from "./hooks/useBidForm";
import { BidDepositDialog } from "./BidDepositDialog";
import { supabase } from "@/integrations/supabase/client";
import { BidErrorAlert } from "./components/BidErrorAlert";
import { PaymentErrorAlert } from "./components/PaymentErrorAlert";
import { BidSuccessMessage } from "./components/BidSuccessMessage";
import { BidInputForm } from "./components/BidInputForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function BidForm({ productId, productTitle, currentPrice }: BidFormProps) {
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [isLoadingBids, setIsLoadingBids] = useState(true);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidCancelled, setBidCancelled] = useState(false);

  // Fetch the current highest bid
  useEffect(() => {
    let mounted = true;

    const fetchHighestBid = async () => {
      try {
        setIsLoadingBids(true);
        
        // Fetch the highest authorized bid - explicitly only get authorized and active bids
        const { data: highestBidData, error: bidError } = await supabase
          .from('bids')
          .select('amount')
          .eq('product_id', productId)
          .eq('payment_status', 'authorized') // Only get authorized bids
          .eq('status', 'active')            // Only get active bids
          .order('amount', { ascending: false })
          .limit(1);

        if (!bidError && highestBidData && highestBidData.length > 0) {
          if (mounted) {
            setHighestBid(highestBidData[0].amount);
          }
        } else {
          // If no authorized bids, fall back to the product's current price
          const { data: product, error } = await supabase
            .from('products')
            .select('current_price, starting_price')
            .eq('id', productId)
            .single();

          if (error) {
            console.error('Error fetching product pricing:', error);
            return;
          }

          if (mounted) {
            // Use starting_price as fallback if no current_price and no highest bid
            setHighestBid(null); // No authorized highest bid
          }
        }
      } catch (err) {
        console.error('Error fetching bid data:', err);
      } finally {
        if (mounted) {
          setIsLoadingBids(false);
        }
      }
    };

    fetchHighestBid();

    // Subscribe to real-time product updates to keep the price current
    const productChannel = supabase
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
          // Update highest bid if changed
          if (mounted && payload.new.highest_bid) {
            setHighestBid(payload.new.highest_bid);
          }
        }
      )
      .subscribe();

    // Listen for new authorized bids
    const bidChannel = supabase
      .channel('authorized-bids-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `product_id=eq.${productId} AND payment_status=eq.authorized AND status=eq.active`
        },
        (payload: any) => {
          console.log('New authorized bid:', payload);
          // Check if the new bid is higher than current highest
          if (mounted && (!highestBid || payload.new.amount > highestBid)) {
            setHighestBid(payload.new.amount);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bids',
          filter: `product_id=eq.${productId}`
        },
        (payload: any) => {
          console.log('Bid updated:', payload);
          
          // If a bid was cancelled, we might need to update the UI
          if (payload.new.status === 'cancelled' || payload.new.payment_status === 'cancelled') {
            // Refetch the highest bid to get the new state
            fetchHighestBid();
          } else if (payload.new.payment_status === 'authorized' && payload.new.status === 'active') {
            // A bid just became authorized
            if (mounted && (!highestBid || payload.new.amount > highestBid)) {
              setHighestBid(payload.new.amount);
            }
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(productChannel);
      supabase.removeChannel(bidChannel);
    };
  }, [productId]);

  const {
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
  } = useBidForm({
    productId,
    productTitle,
    currentPrice: highestBid || currentPrice
  });

  // Handle dialog closing without completing the process
  useEffect(() => {
    if (!depositDialogOpen && paymentClientSecret && !success && !isSubmitting && bidId) {
      // If dialog is closed, client secret exists, but bid isn't successful or in process
      handleBidCancellation();
      setBidCancelled(true);
      
      // Auto-hide the cancelled message after 5 seconds
      const timer = setTimeout(() => {
        setBidCancelled(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [depositDialogOpen, paymentClientSecret, success, isSubmitting, bidId, handleBidCancellation]);

  const validateAndBid = () => {
    // Clear any previous errors and statuses
    setBidError(null);
    setBidCancelled(false);
    
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
    } else if (!highestBid && currentPrice && numericAmount <= currentPrice) {
      setBidError(`Your bid must be higher than the current price of $${currentPrice.toLocaleString()}`);
      return;
    }
    
    // If validation passes, proceed with bid
    handleInitiateBid();
  };

  const clearBidError = () => {
    if (bidError) setBidError(null);
    if (bidCancelled) setBidCancelled(false);
  };

  if (success) {
    return <BidSuccessMessage resetForm={resetForm} />;
  }

  // Use the most accurate price information available
  const displayPrice = highestBid || currentPrice;

  return (
    <>
      <BidErrorAlert bidError={bidError} />
      <PaymentErrorAlert paymentError={paymentError} />
      
      {bidCancelled && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>Bid cancelled. Your payment was not processed.</AlertDescription>
        </Alert>
      )}
      
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
