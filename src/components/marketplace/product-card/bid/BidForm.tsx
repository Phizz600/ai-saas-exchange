
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBidForm } from "./hooks/useBidForm";
import { BidDepositDialog } from "./BidDepositDialog";
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface BidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function BidForm({ productId, productTitle, currentPrice }: BidFormProps) {
  const {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    depositDialogOpen,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateBid,
    handleBidSubmit,
    resetForm
  } = useBidForm({
    productId,
    productTitle,
    currentPrice
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

    // Validate against the current price
    if (currentPrice && numericAmount <= currentPrice) {
      setBidError(`Your bid must be higher than the current price of $${currentPrice.toLocaleString()}`);
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
          Your bid has been received. Once your deposit is confirmed, your bid will be processed.
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
          value={formattedBidAmount}
          onChange={(e) => {
            handleAmountChange(e);
            // Clear error when user starts typing
            if (bidError) setBidError(null);
          }}
          placeholder="$0.00"
          className="font-mono"
        />
        {currentPrice && (
          <p className="text-xs text-gray-500 mt-1">
            Current price: ${currentPrice.toLocaleString()} - Your bid must be higher
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          A 10% refundable deposit is required for all bids
        </p>
      </div>
      
      <Button 
        onClick={validateAndBid}
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
        disabled={isSubmitting || !bidAmount}
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
      />
    </div>
  );
}
