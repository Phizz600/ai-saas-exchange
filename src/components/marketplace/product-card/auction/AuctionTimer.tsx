
import { useState, useEffect } from 'react';
import { Timer, TrendingDown, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { calculateCurrentAuctionPrice } from '@/integrations/supabase/auction';

interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number;
  reservePrice?: number;
  priceDecrement?: number;
  decrementInterval?: string;
  noReserve?: boolean;
  created_at?: string;
}

export function AuctionTimer({
  auctionEndTime,
  currentPrice,
  reservePrice,
  priceDecrement,
  decrementInterval,
  noReserve,
  created_at
}: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [nextDrop, setNextDrop] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  
  useEffect(() => {
    if (!auctionEndTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auctionEndTime).getTime();
      const difference = endTime - now;
      
      if (difference <= 0) {
        setTimeLeft("Auction ended");
        setIsAuctionEnded(true);
        return;
      }
      
      setIsAuctionEnded(false);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);

      // Calculate next price drop time
      if (decrementInterval && priceDecrement) {
        let interval;
        
        switch (decrementInterval) {
          case 'day':
            interval = 24 * 60 * 60 * 1000;
            break;
          case 'week':
            interval = 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            interval = 30 * 24 * 60 * 60 * 1000;
            break;
          default:
            interval = 24 * 60 * 60 * 1000; // Default to daily
        }
        
        const nextDropTime = Math.ceil(now / interval) * interval;
        const timeToNextDrop = nextDropTime - now;
        const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
        const nextDropMinutes = Math.floor((timeToNextDrop % (1000 * 60 * 60)) / (1000 * 60));
        
        setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
      }
    };
    
    calculateTimeLeft();
    
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [auctionEndTime, decrementInterval, priceDecrement]);
  
  return (
    <div className="border-b px-5 py-3 bg-blue-50 text-blue-800 rounded-t-md flex flex-col sm:flex-row gap-2 justify-between">
      <div className="flex items-center gap-1.5">
        <Timer className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isAuctionEnded ? 'Auction ended' : timeLeft ? timeLeft : 'Loading...'}
        </span>
      </div>
      
      {!isAuctionEnded && priceDecrement && decrementInterval && (
        <div className="flex items-center gap-1.5">
          <TrendingDown className="h-4 w-4" />
          <span className="text-sm font-medium">
            {`Next price drop: ${nextDrop || 'Calculating...'} (-${formatCurrency(priceDecrement)})` }
          </span>
        </div>
      )}
      
      {noReserve && (
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-600">No reserve auction</span>
        </div>
      )}
    </div>
  );
}
