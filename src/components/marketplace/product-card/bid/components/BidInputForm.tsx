
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface BidInputFormProps {
  bidAmount: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingBids: boolean;
  highestBid: number | null;
  currentPrice?: number;
  isSubmitting: boolean;
  validateAndBid: () => void;
  clearBidError?: () => void;
}

export function BidInputForm({
  bidAmount,
  handleAmountChange,
  isLoadingBids,
  highestBid,
  currentPrice,
  isSubmitting,
  validateAndBid,
  clearBidError
}: BidInputFormProps) {
  return (
    <div className="space-y-3">
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
            if (clearBidError) clearBidError();
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
    </div>
  );
}
