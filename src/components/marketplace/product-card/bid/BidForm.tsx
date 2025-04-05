
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
    const fetchHighestBid = async () => {
      try {
        setIsLoadingBids(true);
        
        // Fetch the highest authorized bid
        const { data: highestBidData, error: bidError } = await supabase
          .from('bids')
          .select('amount')
          .eq('product_id', productId)
          .eq('payment_status', 'authorized') // Only get authorized bids
          .eq('status', 'active')
          .order('amount', { ascending: false })
          .limit(1)
          .single();

        if (!bidError && highestBidData) {
          setHighestBid(highestBidData.amount);
        } else {
          // If no authorized bids, fall back to the product's current price
          const { data: product, error } = await supabase
            .from('products')
            .select('current_price')
            .eq('id', productId)
            .single();

          if (error) {
            console.error('Error fetching product pricing:', error);
            return;
          }

          setHighestBid(null); // No authorized highest bid
        }
        
        // Subscribe to real-time product updates to keep the price current
        const channel = supabase
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
              if (!highestBid || payload.new.amount > highestBid) {
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
              filter: `product_id=eq.${productId} AND payment_status=eq.authorized AND status=eq.active`
            },
            (payload: any) => {
              console.log('Bid updated to authorized:', payload);
              // Check if the updated bid is higher than current highest
              if (!highestBid || payload.new.amount > highestBid) {
                setHighestBid(payload.new.amount);
              }
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
  }, [productId, highestBid]);

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

  // Handle dialog closing without completing the process
  useEffect(() => {
    if (!depositDialogOpen && paymentClientSecret && !success && !isSubmitting) {
      // If dialog is closed, client secret exists, but bid isn't successful or in process
      setBidCancelled(true);
      
      // Auto-hide the cancelled message after 5 seconds
      const timer = setTimeout(() => {
        setBidCancelled(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [depositDialogOpen, paymentClientSecret, success, isSubmitting]);

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
