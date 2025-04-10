
import { useState, useEffect } from "react";
import { Clock, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format, differenceInSeconds, differenceInHours, differenceInDays } from "date-fns";

interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number;
  reservePrice?: number; // Renamed from minPrice to reservePrice
  priceDecrement?: number;
  decrementInterval?: string;
}

export function AuctionTimer({ 
  auctionEndTime, 
  currentPrice, 
  reservePrice, 
  priceDecrement, 
  decrementInterval 
}: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [nextDropIn, setNextDropIn] = useState<string>("");
  const [nextPrice, setNextPrice] = useState<number | null>(null);
  
  // Get color based on time remaining
  const getTimeColor = () => {
    if (!auctionEndTime) return "text-gray-500";
    
    const now = new Date();
    const end = new Date(auctionEndTime);
    const hoursLeft = differenceInHours(end, now);
    
    if (hoursLeft < 12) return "text-red-500";
    if (hoursLeft < 48) return "text-orange-500";
    return "text-green-500";
  };

  const calculateNextDecrement = () => {
    if (!decrementInterval || !priceDecrement || !currentPrice) return;
    
    const now = new Date();
    let nextDecrementTime = new Date(now);
    
    // Calculate next decrement time
    switch (decrementInterval) {
      case "minute":
        nextDecrementTime.setMinutes(now.getMinutes() + 1, 0, 0);
        break;
      case "hour":
        nextDecrementTime.setHours(now.getHours() + 1, 0, 0, 0);
        break;
      case "day":
        nextDecrementTime.setHours(0, 0, 0, 0);
        nextDecrementTime.setDate(now.getDate() + 1);
        break;
      case "week":
        const dayOfWeek = now.getDay();
        const daysUntilNextWeek = 7 - dayOfWeek;
        nextDecrementTime.setDate(now.getDate() + daysUntilNextWeek);
        nextDecrementTime.setHours(0, 0, 0, 0);
        break;
      case "month":
        nextDecrementTime.setDate(1);
        nextDecrementTime.setMonth(now.getMonth() + 1);
        nextDecrementTime.setHours(0, 0, 0, 0);
        break;
    }
    
    // Calculate time until next decrement
    const secondsToNextDecrement = differenceInSeconds(nextDecrementTime, now);
    
    if (secondsToNextDecrement <= 0) return;
    
    // Format time until next drop
    const hours = Math.floor(secondsToNextDecrement / 3600);
    const minutes = Math.floor((secondsToNextDecrement % 3600) / 60);
    const seconds = Math.floor(secondsToNextDecrement % 60);
    
    let nextDropText = "";
    if (hours > 0) {
      nextDropText = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      nextDropText = `${minutes}m ${seconds}s`;
    } else {
      nextDropText = `${seconds}s`;
    }
    
    setNextDropIn(nextDropText);
    
    // Calculate next price
    const minimumReserve = reservePrice || 0;
    const nextPriceValue = Math.max(currentPrice - priceDecrement, minimumReserve);
    setNextPrice(nextPriceValue);
  };
  
  useEffect(() => {
    if (!auctionEndTime) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(auctionEndTime);
      
      if (now >= end) {
        setTimeLeft("Auction ended");
        return;
      }
      
      const secondsDiff = differenceInSeconds(end, now);
      const days = Math.floor(secondsDiff / 86400);
      const hours = Math.floor((secondsDiff % 86400) / 3600);
      const minutes = Math.floor((secondsDiff % 3600) / 60);
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        const seconds = Math.floor(secondsDiff % 60);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${secondsDiff}s`);
      }
    };
    
    calculateTimeLeft();
    calculateNextDecrement();
    
    const timerInterval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    
    const decrementInterval = setInterval(() => {
      calculateNextDecrement();
    }, 10000); // Check for next decrement every 10 seconds
    
    return () => {
      clearInterval(timerInterval);
      clearInterval(decrementInterval);
    };
  }, [auctionEndTime, currentPrice, reservePrice, priceDecrement, decrementInterval]);
  
  if (!auctionEndTime || !currentPrice) return null;
  
  return (
    <div className="bg-gray-50 px-5 py-3 border-b">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className={`h-4 w-4 ${getTimeColor()}`} />
            <span>Ends in: </span>
            <span className={`font-mono ${getTimeColor()}`}>{timeLeft}</span>
          </div>
          
          {nextPrice && nextPrice < currentPrice && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <ArrowDownRight className="h-3.5 w-3.5 text-amber-500" />
              <div className="flex flex-col">
                <span>Next: {formatCurrency(nextPrice)}</span>
                <span className="text-xs text-gray-400">in {nextDropIn}</span>
              </div>
            </div>
          )}
        </div>
        
        {reservePrice && reservePrice > 0 && (
          <div className="text-xs text-gray-500 flex justify-between">
            <span>Reserve price: {formatCurrency(reservePrice)}</span>
            {decrementInterval && priceDecrement && (
              <span>Drops {formatCurrency(priceDecrement)} {decrementInterval.toLowerCase()}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
