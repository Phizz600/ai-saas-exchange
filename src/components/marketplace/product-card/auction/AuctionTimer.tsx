
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Timer, TrendingDown, Clock } from "lucide-react";
import { useAuctionPricing } from "../useAuctionPricing";

interface AuctionTimerProps {
  auctionEndTime?: string;
  startingPrice?: number;
  currentPrice?: number;
  minPrice?: number;
  priceDecrement?: number;
  decrementInterval?: string;
  createdAt?: string;
}

export function AuctionTimer({
  auctionEndTime,
  startingPrice,
  currentPrice,
  minPrice,
  priceDecrement,
  decrementInterval,
  createdAt,
}: AuctionTimerProps) {
  const { timeLeft, currentPrice: calculatedPrice, isAuctionEnded } = useAuctionPricing({
    auction_end_time: auctionEndTime,
    starting_price: startingPrice,
    current_price: currentPrice,
    min_price: minPrice,
    price_decrement: priceDecrement,
    price_decrement_interval: decrementInterval,
    created_at: createdAt || "",
  });

  const displayPrice = calculatedPrice || currentPrice || startingPrice || 0;
  const maxPrice = startingPrice || 0;
  const minPriceValue = minPrice || 0;
  
  // Calculate the price progress percentage (how far the price has dropped)
  const totalPriceDrop = maxPrice - minPriceValue;
  const currentDrop = maxPrice - displayPrice;
  const progressPercentage = totalPriceDrop > 0 
    ? Math.min(100, (currentDrop / totalPriceDrop) * 100)
    : 0;

  // Format the decrement interval for display
  const formatInterval = (interval?: string) => {
    if (!interval) return "hour";
    return interval;
  };
  
  if (isAuctionEnded) {
    return (
      <div className="px-4 py-2 bg-gray-100 border-b">
        <Badge variant="outline" className="bg-gray-200 text-gray-700">
          Auction Ended
        </Badge>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-purple-50 border-b">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-amber-700">
          <Timer className="h-3.5 w-3.5 mr-1.5" />
          <span className="font-medium">{timeLeft}</span>
        </div>
        <div className="flex items-center text-purple-700">
          <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {priceDecrement ? `-$${priceDecrement.toLocaleString()}/${formatInterval(decrementInterval)}` : "Price dropping"}
          </span>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Current: {formatCurrency(displayPrice)}</span>
          <span className="text-gray-600">Min: {formatCurrency(minPriceValue)}</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-1.5 bg-gradient-to-r from-amber-500 to-purple-500" 
        />
      </div>
    </div>
  );
}
