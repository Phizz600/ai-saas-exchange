
import { useState, useEffect } from "react";

export function useAuctionTimer(
  auctionEndTime: string | undefined, 
  decrementInterval?: string, 
  isDutchAuction: boolean = false,
  updatedAt?: string
) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [nextDropTime, setNextDropTime] = useState<Date | null>(null);
  
  useEffect(() => {
    if (!auctionEndTime && !isDutchAuction) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      
      // For Dutch auctions with a decrement interval, calculate time until next price drop
      if (isDutchAuction && decrementInterval) {
        // If we have an updated_at timestamp, use that as the base for next drop calculation
        const baseTime = updatedAt ? new Date(updatedAt) : now;
        let nextDrop = new Date(baseTime);
        
        // Calculate the next drop time based on the interval
        switch(decrementInterval) {
          case 'minute':
            nextDrop = new Date(nextDrop.setMinutes(nextDrop.getMinutes() + 1));
            break;
          case 'hour':
            nextDrop = new Date(nextDrop.setHours(nextDrop.getHours() + 1));
            break;
          case 'day':
            nextDrop = new Date(nextDrop.setDate(nextDrop.getDate() + 1));
            break;
          case 'week':
            nextDrop = new Date(nextDrop.setDate(nextDrop.getDate() + 7));
            break;
          case 'month':
            nextDrop = new Date(nextDrop.setMonth(nextDrop.getMonth() + 1));
            break;
          default:
            nextDrop = new Date(nextDrop.setHours(nextDrop.getHours() + 1)); // Default to hourly
        }
        
        setNextDropTime(nextDrop);
        
        // Calculate time difference until next drop
        const difference = nextDrop.getTime() - now.getTime();
        
        if (difference <= 0) {
          setTimeLeft("Updating price...");
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // If it's a short interval (minutes), include seconds
        if (decrementInterval === 'minute') {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m`);
        }
      } 
      // For standard auctions, calculate time until auction end
      else if (auctionEndTime) {
        const endTime = new Date(auctionEndTime).getTime();
        const difference = endTime - now.getTime();

        if (difference <= 0) {
          setTimeLeft("Auction ended");
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    };

    calculateTimeLeft();
    // For shorter intervals, we need more frequent updates
    const updateInterval = decrementInterval === 'minute' ? 1000 : 60000;
    const timer = setInterval(calculateTimeLeft, updateInterval);
    
    return () => clearInterval(timer);
  }, [auctionEndTime, decrementInterval, isDutchAuction, updatedAt]);

  return { timeLeft, nextDropTime };
}
