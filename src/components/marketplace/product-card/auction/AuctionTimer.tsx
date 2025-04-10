
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
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [auctionEndTime]);

  if (!auctionEndTime) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-purple-50 py-2 px-3 border-b border-gray-200">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4 text-amber-600" />
          <span className="font-medium text-sm text-amber-800">{timeLeft}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown className="h-4 w-4 text-purple-600" />
          <span className="font-medium text-sm text-purple-700">Price dropping</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <span className="text-xs font-medium text-gray-600">Current:</span>
          <div className="text-sm font-bold text-gray-800">
            ${formatNumber(currentPrice)}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-gray-600">Min:</span>
          <div className="text-sm font-medium text-gray-800">
            ${formatNumber(minPrice)}
          </div>
        </div>
      </div>
      
      <Progress 
        value={progressValue} 
        className="h-1.5 bg-amber-200"
      />
    </div>
  );
}
