
import { Clock, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";

interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number;
  reservePrice?: number;
  priceDecrement?: number;
  decrementInterval?: string;
  noReserve?: boolean;
}

export function AuctionTimer({
  auctionEndTime,
  currentPrice,
  reservePrice,
  priceDecrement,
  decrementInterval,
  noReserve
}: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  
  useEffect(() => {
    if (!auctionEndTime) return;
    
    // Update time remaining
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(auctionEndTime);
      const diffMs = endTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeRemaining("Auction ended");
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [auctionEndTime]);
  
  if (!auctionEndTime) return null;
  
  return (
    <div className="bg-amber-50 rounded-t-md p-3 border-b border-amber-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-amber-800">
          <TrendingDown className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">Dutch Auction</span>
        </div>
        {priceDecrement && decrementInterval && <div className="text-xs text-amber-700">
            Drops ${priceDecrement} per {decrementInterval}
          </div>}
      </div>
      
      <div className="mt-2 text-xs text-amber-700">
        {currentPrice !== undefined && (
          <div className="font-medium mb-1">
            Current price: {formatCurrency(currentPrice)}
          </div>
        )}
        
        {timeRemaining && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Time remaining: {timeRemaining}</span>
          </div>
        )}
      </div>
      
      {noReserve && <div className="mt-1 text-xs text-amber-700 flex items-center">
        <span className="bg-amber-200 text-amber-800 text-xs px-1.5 py-0.5 rounded">No Reserve</span>
        <span className="ml-1">Sells at any price!</span>
      </div>}
      
      {!noReserve && reservePrice !== undefined && reservePrice > 0 && <div className="mt-1 text-xs text-amber-700">
        Reserve price: {formatCurrency(reservePrice)}
      </div>}
    </div>
  );
}
