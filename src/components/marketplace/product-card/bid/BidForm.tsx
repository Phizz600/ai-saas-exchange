
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
import { toast } from "sonner";

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
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch the current highest bid
  useEffect(() => {
    let mounted = true;
    console.log(`BidForm initialized for product ${productId} with currentPrice: ${currentPrice}`);

    const fetchHighestBid = async () => {
      try {
        setIsLoadingBids(true);
        setFetchError(null);
        
        console.log("Fetching highest bid data for product:", productId);
        
        // First try to get the highest bid directly from the product
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('highest_bid, current_price')
          .eq('id', productId)
          .single();
        
        if (productError) {
          console.error('Error fetching product:', productError);
          setFetchError(`Could not retrieve product data: ${productError.message}`);
          setIsLoadingBids(false);
          
          toast.error("Error loading bid data", {
            description: "There was a problem retrieving current bid information."
          });
          
          return;
        }
        
        console.log('Product data:', product);
        
        // If there's a highest bid, use that
        if (product && product.highest_bid) {
          if (mounted) {
            console.log('Setting highest bid from product:', product.highest_bid);
            setHighestBid(product.highest_bid);
          }
          setIsLoadingBids(false);
          return;
        }
        
        // As a fallback, fetch the highest authorized bid
        const { data: highestBidData, error: bidError } = await supabase
          .from('bids')
          .select('amount')
          .eq('product_id', productId)
          .eq('payment_status', 'authorized')
          .eq('status', 'active')
          .order('amount', { ascending: false })
          .limit(1);

        if (bidError) {
          console.error('Error fetching bids:', bidError);
          setFetchError(`Could not retrieve bid data: ${bidError.message}`);
        }

        if (!bidError && highestBidData && highestBidData.length > 0) {
          if (mounted) {
            console.log('Setting highest bid from bids table:', highestBidData[0].amount);
            setHighestBid(highestBidData[0].amount);
          }
        } else {
          // If no authorized bids, use the product's current price
          if (mounted && product) {
            console.log('No highest bid found, using current price:', product.current_price);
            // Don't set highest bid here, as we want to differentiate between
            // a real bid and just the current price
            setHighestBid(null);
          }
        }
      } catch (err: any) {
        console.error('Error fetching bid data:', err);
        setFetchError(`Unexpected error: ${err.message}`);
        
        toast.error("Error loading bid data", {
          description: "There was a problem retrieving current bid information."
        });
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
      .subscribe((status) => {
        console.log(`Product channel subscription status: ${status}`);
      });

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
      .subscribe((status) => {
        console.log(`Bid channel subscription status: ${status}`);
      });

    return () => {
      console.log("Cleaning up BidForm subscriptions");
      mounted = false;
      supabase.removeChannel(productChannel);
      supabase.removeChannel(bidChannel);
    };
  }, [productId, highestBid, currentPrice]);

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
    currentPrice: highestBid || currentPrice,
    onValidationError: (error) => setBidError(error)
  });

  // Handle dialog closing without completing the process
  useEffect(() => {
    if (!depositDialogOpen && paymentClientSecret && !success && !isSubmitting && bidId) {
      // If dialog is closed, client secret exists, but bid isn't successful or in process
      console.log("Bid process interrupted, cancelling bid:", bidId);
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
    console.log("Validating bid amount:", numericAmount, "against highest bid:", highestBid, "or current price:", currentPrice);
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.log("Invalid bid amount:", bidAmount);
      setBidError("Please enter a valid amount for your bid.");
      return;
    }

    // Validate against the current highest bid
    if (highestBid && numericAmount <= highestBid) {
      console.log("Bid too low compared to highest bid:", numericAmount, "≤", highestBid);
      setBidError(`Your bid must be higher than the current highest bid of $${highestBid.toLocaleString()}`);
      return;
    } else if (!highestBid && currentPrice && numericAmount <= currentPrice) {
      console.log("Bid too low compared to current price:", numericAmount, "≤", currentPrice);
      setBidError(`Your bid must be higher than the current price of $${currentPrice.toLocaleString()}`);
      return;
    }
    
    console.log("Bid validation passed, proceeding with bid:", numericAmount);
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

  // Display fetch error if there was a problem loading bid data
  if (fetchError) {
    return (
      <Alert variant="destructive" className="mb-3">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          {fetchError}
          <div className="mt-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white text-destructive px-4 py-2 rounded font-medium hover:bg-gray-100"
            >
              Refresh Page
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
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
