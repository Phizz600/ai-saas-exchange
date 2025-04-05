import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBidForm } from "./hooks/useBidForm";
import { BidDepositDialog } from "./BidDepositDialog";
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { AlertCircle, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function BidForm({ productId, productTitle, currentPrice }: BidFormProps) {
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [isLoadingBids, setIsLoadingBids] = useState(true);

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

  const [bidError, setBidError] = useState<string | null>(null);

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

  if (success) {
    return (
      <div className="space-y-4 bg-green-50 p-4 rounded-md">
        <h3 className="font-medium text-green-800">Bid Successfully Submitted!</h3>
        <p className="text-sm text-green-700">
          Your bid has been received and your payment method has been authorized. No charges have been made to your card yet - you'll only be charged if you win this auction.
        </p>
        <Button
          onClick={resetForm}
          variant="outline"
          size="sm"
        >
          Place Another Bid
        </Button>
      </div>
    );
  }

  // Determine the effective minimum bid amount - prioritize highest bid
  const effectiveMinBid = highestBid || currentPrice;

  return (
    <div className="space-y-3">
      {bidError && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{bidError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col">
        <label htmlFor="bidAmount" className="text-sm mb-1 font-medium">
          Your Bid Amount
        </label>
        <Input
          id="bidAmount"
          type="text"
          value={bidAmount}
          onChange={(e) => {
            handleAmountChange(e);
            // Clear error when user starts typing
            if (bidError) setBidError(null);
          }}
          placeholder="$0.00"
          className="font-mono"
        />
        {isLoadingBids ? (
          <p className="text-xs text-gray-500 mt-1">Loading current bid information...</p>
        ) : (
          <>
            {highestBid ? (
              <p className="text-xs text-gray-500 mt-1">
                Current highest bid: ${highestBid.toLocaleString()} - Your bid must be higher
              </p>
            ) : currentPrice ? (
              <p className="text-xs text-gray-500 mt-1">
                Starting price: ${currentPrice.toLocaleString()} - Your bid must be higher
              </p>
            ) : null}
          </>
        )}
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <CreditCard className="h-3 w-3" />
          Your card will be authorized but not charged until you win
        </p>
      </div>
      
      <Button 
        onClick={validateAndBid}
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
        disabled={isSubmitting || !bidAmount || isLoadingBids}
      >
        {isSubmitting ? "Processing..." : "Place Bid"}
      </Button>

      <BidDepositDialog
        open={depositDialogOpen}
        onClose={() => setDepositDialogOpen(false)}
        onConfirm={handleBidSubmit}
        productId={productId}
        bidAmount={parseFloat(bidAmount) || 0}
        productTitle={productTitle}
        clientSecret={paymentClientSecret}
      />
    </div>
  );
}
