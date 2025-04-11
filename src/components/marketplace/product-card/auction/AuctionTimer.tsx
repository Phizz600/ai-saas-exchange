
import { useEffect, useState } from "react";
import { Timer, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { calculateCurrentAuctionPrice } from "@/integrations/supabase/auction";

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
  currentPrice = 0,
  reservePrice = 0,
  priceDecrement = 0,
  decrementInterval = "hour",
  noReserve = false
}: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(currentPrice);
  const [auctionProgress, setAuctionProgress] = useState(0);
  
  useEffect(() => {
    if (auctionEndTime) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const end = new Date(auctionEndTime);
        const start = new Date(end.getTime() - (7 * 24 * 60 * 60 * 1000)); // Assume 7-day auction
        const totalDuration = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        const diff = end.getTime() - now.getTime();
        
        // Calculate progress percentage (0-100)
        const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setAuctionProgress(progressPercentage);
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);

          // Calculate current price
          const calculatedCurrentPrice = calculateCurrentAuctionPrice(currentPrice, reservePrice, priceDecrement, decrementInterval, auctionEndTime, now);
          setCalculatedPrice(calculatedCurrentPrice);
        } else {
          setTimeRemaining("Auction Ended");
          setAuctionProgress(100);
          clearInterval(intervalId);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [auctionEndTime, currentPrice, reservePrice, priceDecrement, decrementInterval]);

  // Format currency
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="rounded-md overflow-hidden">
      <div className="p-4" style={{
        background: 'linear-gradient(to right, #FEFBEA, #FBF5FF)'
      }}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-amber-700">
            <Timer className="w-5 h-5 mr-1" />
            <span className="exo-2-header text-sm font-bold">{timeRemaining}</span>
          </div>
          <div className="flex items-center text-purple-700">
            <TrendingDown className="w-5 h-5 mr-1" />
            <span className="exo-2-header text-sm font-bold">Price dropping</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-gray-700 text-sm">Current:</span>
            <p className="font-bold text-gray-800 text-sm">{formatPrice(calculatedPrice)}</p>
          </div>
          <div className="text-right">
            <span className="text-gray-700 text-sm">Min:</span>
            <p className="font-bold text-gray-800 text-sm">
              {noReserve ? "$0" : formatPrice(reservePrice)}
            </p>
          </div>
        </div>
        
        {/* Progress Bar with gradient */}
        <Progress 
          value={auctionProgress} 
          className="h-2 mt-2 bg-yellow-100"
          // The Progress component already has the color gradient defined
        />
      </div>
    </div>
  );
}
