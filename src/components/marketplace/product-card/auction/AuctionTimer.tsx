
import { useState, useEffect } from "react";
import { Timer, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number;
  minPrice?: number;
  priceDecrement?: number;
  decrementInterval?: string;
}

export function AuctionTimer({
  auctionEndTime,
  currentPrice,
  minPrice,
  priceDecrement,
  decrementInterval
}: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [nextDrop, setNextDrop] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0);
  
  // Format a numeric value with commas for thousands
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };
  
  // Calculate the progress percentage for price drop visualization
  useEffect(() => {
    if (currentPrice && minPrice !== undefined && currentPrice >= minPrice) {
      // If starting price is available, use it, otherwise use a default multiplier
      const startingPrice = currentPrice * 1.5; // Estimate starting price if not available
      const range = startingPrice - minPrice;
      const current = startingPrice - currentPrice;
      const percentage = Math.min(100, Math.max(0, (current / range) * 100));
      setProgressValue(percentage);
    }
  }, [currentPrice, minPrice]);
  
  // Handle countdown timer
  useEffect(() => {
    if (!auctionEndTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auctionEndTime).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      
      // Calculate next price drop time
      const interval = decrementInterval === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const nextDropTime = Math.ceil(now / interval) * interval;
      const timeToNextDrop = nextDropTime - now;
      const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
      const nextDropMinutes = Math.floor((timeToNextDrop % (1000 * 60 * 60)) / (1000 * 60));
      setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [auctionEndTime, decrementInterval]);

  if (!auctionEndTime) return null;

  return (
    <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Timer className="h-4 w-4" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-600">
          <TrendingDown className="h-4 w-4" />
          <span>-${formatNumber(priceDecrement)}/{decrementInterval || 'hour'}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <span className="text-xs font-semibold text-gray-600">Current</span>
          <div className="text-sm font-bold text-purple-600">
            ${formatNumber(currentPrice)}
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-600">Min Price</span>
          <div className="text-sm font-medium text-gray-800">
            ${formatNumber(minPrice)}
          </div>
        </div>
      </div>
      
      <Progress 
        value={progressValue} 
        className="h-2 bg-gradient-to-r from-amber-200 to-purple-200"
      />
    </div>
  );
}
