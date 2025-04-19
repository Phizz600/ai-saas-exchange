
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Timer } from "lucide-react";
import { useAuctionTimer } from "../useAuctionTimer";

interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number;
  reservePrice?: number;
  priceDecrement?: number;
  decrementInterval?: string;
  noReserve?: boolean;
  isDutchAuction?: boolean;
}

export function AuctionTimer({
  auctionEndTime,
  currentPrice,
  reservePrice,
  priceDecrement,
  decrementInterval,
  noReserve,
  isDutchAuction = false
}: AuctionTimerProps) {
  const { timeLeft } = useAuctionTimer(auctionEndTime);
  const [displayPrice, setDisplayPrice] = useState<number | undefined>(currentPrice);
  const [nextPrice, setNextPrice] = useState<number | undefined>();
  const [nextUpdateTime, setNextUpdateTime] = useState<string>("");
  
  // Calculate the next price drop time
  useEffect(() => {
    if (!isDutchAuction || !priceDecrement || !decrementInterval || !currentPrice) {
      return;
    }
    
    // No need to calculate next price if it would go below reserve
    if (reservePrice && currentPrice - priceDecrement < reservePrice) {
      setNextPrice(undefined);
      setNextUpdateTime("Floor price reached");
      return;
    }
    
    // Calculate next price after decrement
    const nextPriceValue = currentPrice - priceDecrement;
    setNextPrice(nextPriceValue);
    
    // Calculate when the next price update will happen
    let timeUnit = "";
    switch(decrementInterval) {
      case 'minute': timeUnit = "minute"; break;
      case 'hour': timeUnit = "hour"; break;
      case 'day': timeUnit = "day"; break;
      case 'week': timeUnit = "week"; break;
      case 'month': timeUnit = "month"; break;
      default: timeUnit = "minute";
    }
    
    setNextUpdateTime(`Next price drop in 1 ${timeUnit}`);
  }, [isDutchAuction, currentPrice, priceDecrement, decrementInterval, reservePrice]);
  
  // Update displayed price
  useEffect(() => {
    setDisplayPrice(currentPrice);
  }, [currentPrice]);

  // Format reserve price for display
  const formattedReservePrice = noReserve 
    ? "No Reserve" 
    : reservePrice 
      ? `$${reservePrice.toLocaleString()}`
      : "Not set";
  
  return (
    <div className="w-full bg-amber-50 rounded-md p-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-xs text-gray-500">Current Price</p>
          <p className="text-lg font-bold text-amber-800">
            ${displayPrice?.toLocaleString() || "Loading..."}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Time Left</p>
          <div className="flex items-center space-x-1">
            <Timer className="h-3 w-3 text-amber-800" />
            <p className="text-sm font-medium text-amber-800">{timeLeft || "Loading..."}</p>
          </div>
        </div>
      </div>
      
      {isDutchAuction && priceDecrement && (
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>
            Reserve: {formattedReservePrice}
          </span>
          {nextPrice && (
            <span>
              Next: ${nextPrice.toLocaleString()} ({nextUpdateTime})
            </span>
          )}
        </div>
      )}
      
      <Button 
        asChild 
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
      >
        <Link to={`/product/${auctionEndTime ? `?bid=true` : ''}`} className="flex items-center justify-center">
          {isDutchAuction ? "Place Bid Now" : "View Auction"} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
