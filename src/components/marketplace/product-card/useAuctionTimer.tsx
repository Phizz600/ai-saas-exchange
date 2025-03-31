
import { useState, useEffect } from "react";

interface AuctionTimerOptions {
  priceDecrementInterval?: string;
}

export function useAuctionTimer(
  auctionEndTime: string | undefined, 
  options: AuctionTimerOptions = {}
) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [nextDrop, setNextDrop] = useState<string>("");
  const { priceDecrementInterval = "hour" } = options;
  
  // Calculate the interval in milliseconds
  const getIntervalInMilliseconds = () => {
    switch(priceDecrementInterval) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000; // Default to hour
    }
  };
  
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
      
      // Calculate next price drop
      const interval = getIntervalInMilliseconds();
      const nextDropTime = Math.ceil(now / interval) * interval;
      const timeToNextDrop = nextDropTime - now;
      
      // Format the next drop time
      const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
      const nextDropMinutes = Math.floor((timeToNextDrop % (1000 * 60 * 60)) / (1000 * 60));
      
      if (nextDropHours > 0) {
        setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
      } else {
        setNextDrop(`${nextDropMinutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [auctionEndTime, priceDecrementInterval]);

  return { timeLeft, nextDrop };
}
