
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
          const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);

          // Calculate current price
          const calculatedCurrentPrice = calculateCurrentAuctionPrice(currentPrice, reservePrice, priceDecrement, decrementInterval, auctionEndTime, now);
          setCalculatedPrice(calculatedCurrentPrice);
        } else {
          setTimeRemaining("Auction Ended");
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

  // Calculate the progress percentage for the progress bar
  const calculateProgress = (): string => {
    if (noReserve) return "100%";

    // For auctions with a reserve price
    const startingPrice = currentPrice;
    const currentCalculatedPrice = calculatedPrice;
    if (startingPrice === reservePrice) return "0%";
    const totalPriceDrop = startingPrice - reservePrice;
    const currentPriceDrop = startingPrice - currentCalculatedPrice;
    const progressPercentage = currentPriceDrop / totalPriceDrop * 100;
    return `${Math.min(100, Math.max(0, progressPercentage))}%`;
  };
  
  return (
    <div className="rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-100 to-purple-100 p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-amber-700">
            <Timer className="w-5 h-5 mr-1" />
            <span className="font-medium text-lg">{timeRemaining}</span>
          </div>
          <div className="flex items-center text-purple-700">
            <TrendingDown className="w-5 h-5 mr-1" />
            <span className="font-medium text-lg">Price dropping</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-gray-700 text-sm">Current:</span>
            <p className="text-xl font-bold text-gray-800">{formatPrice(calculatedPrice)}</p>
          </div>
          <div className="text-right">
            <span className="text-gray-700 text-sm">Min:</span>
            <p className="text-xl font-bold text-gray-800">
              {noReserve ? "$0" : formatPrice(reservePrice)}
            </p>
          </div>
        </div>
        
        {/* Progress Bar with gradient */}
        <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 h-2 rounded-full" 
            style={{
              width: "100%"
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
