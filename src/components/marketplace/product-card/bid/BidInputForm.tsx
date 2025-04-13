
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BidInputFormProps {
  bidAmount: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingBids: boolean;
  highestBid: number | null;
  currentPrice: number | undefined;
  isSubmitting: boolean;
  validateAndBid: () => void;
  clearBidError: () => void;
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
  // Format the current price for display
  const displayPrice = highestBid || currentPrice || 0;
  
  return (
    <div>
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <Input
            type="text"
            value={bidAmount}
            onChange={(e) => {
              handleAmountChange(e);
              clearBidError();
            }}
            placeholder="Enter bid amount"
            className="pl-8"
            disabled={isSubmitting}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          {isLoadingBids ? (
            <span className="flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Loading current bid...
            </span>
          ) : highestBid ? (
            <>
              Current highest bid: {formatCurrency(highestBid)} - Your bid must be higher
            </>
          ) : (
            <>
              Current price: {formatCurrency(displayPrice)} - Your bid must be at least this amount
            </>
          )}
        </p>
      </div>

      <Button
        onClick={validateAndBid}
        disabled={isSubmitting || isLoadingBids}
        className="w-full mt-3 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          "Place Bid"
        )}
      </Button>
    </div>
  );
}
