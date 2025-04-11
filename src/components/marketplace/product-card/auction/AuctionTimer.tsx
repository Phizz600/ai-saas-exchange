
import { useEffect, useState } from "react";
import { calculateCurrentAuctionPrice } from "@/integrations/supabase/auction";

interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number; 
  reservePrice?: number; // Changed from minPrice
  priceDecrement?: number;
  decrementInterval?: string;
  noReserve?: boolean; // Added no_reserve field
}

export function AuctionTimer({ 
  auctionEndTime, 
  currentPrice = 0,
  reservePrice = 0, // Changed from minPrice
  priceDecrement = 0,
  decrementInterval = "hour",
  noReserve = false // Added no_reserve prop
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

  return (
    <div className="bg-amber-100 text-amber-700 p-3 rounded-md text-sm">
      {timeRemaining ? (
        <>
          Time Remaining: {timeRemaining}
          <br />
          Current Price: ${calculatedPrice?.toLocaleString()}
          {!noReserve && reservePrice > 0 && (
            <>
              <br />
              Reserve Price: ${reservePrice?.toLocaleString()}
            </>
          )}
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
