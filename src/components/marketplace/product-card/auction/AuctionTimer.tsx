
import { useEffect, useState } from "react";
import { Timer, TrendingDown } from "lucide-react";
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

  useEffect(() => {
    if (auctionEndTime) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const end = new Date(auctionEndTime);
        const diff = end.getTime() - now.getTime();

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);

          // Calculate current price
          const calculatedCurrentPrice = calculateCurrentAuctionPrice(
            currentPrice,
            reservePrice,
            priceDecrement,
            decrementInterval,
            auctionEndTime,
            now
          );
          setCalculatedPrice(calculatedCurrentPrice);
        } else {
          setTimeRemaining("Auction Ended");
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [auctionEndTime, currentPrice, reservePrice, priceDecrement, decrementInterval]);

  // Format the timeRemaining to display as in the screenshot (e.g., "19d 9h 8m")
  const formatTimeRemaining = (time: string | null): string => {
    if (!time) return "";
    if (time === "Auction Ended") return time;
    
    // Remove seconds from display and trailing spaces
    return time.replace(/\s\d+s$/, "").trim();
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Auction Header with Dutch Auction badge */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white p-2 px-4 flex items-center">
        <TrendingDown className="w-5 h-5 mr-2" />
        <span className="font-medium">Dutch Auction</span>
      </div>
      
      {/* Time and Price Information */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-orange-800">
            <Timer className="w-5 h-5 mr-2 text-orange-600" />
            <span className="font-medium text-lg">{formatTimeRemaining(timeRemaining)}</span>
          </div>
          <div className="flex items-center text-purple-700">
            <TrendingDown className="w-5 h-5 mr-2" />
            <span>Price dropping</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-gray-600">Current:</span>
            <p className="text-2xl font-bold">${calculatedPrice?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="text-gray-600">Min:</span>
            <p className="text-2xl font-bold">
              {noReserve ? "$0" : `$${reservePrice?.toLocaleString()}`}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-yellow-200 to-yellow-300 h-2 rounded-full" 
            style={{ 
              width: noReserve 
                ? `${100 - (calculatedPrice / (currentPrice * 2)) * 100}%` 
                : `${100 - ((calculatedPrice - reservePrice) / (currentPrice - reservePrice)) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
