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
  return <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-orange-500">
          <Timer className="w-4 h-4 mr-1" />
          <span className="font-medium text-sm">{timeRemaining}</span>
        </div>
        <div className="flex items-center text-[#8B5CF6]">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span className="font-medium text-sm">Price dropping</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <div>
          <span className="text-xs text-gray-600">Current:</span>
          <p className="text-sm font-bold">{formatPrice(calculatedPrice)}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-600">Min:</span>
          <p className="text-sm font-bold">
            {noReserve ? "$0" : formatPrice(reservePrice)}
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-yellow-100 rounded-full h-2 mt-2">
        <div className="bg-yellow-200 h-2 rounded-full" style={{
        width: "100%"
      }}></div>
      </div>
    </div>;
}