
import { useState, useEffect } from "react";

interface AuctionStateProps {
  auctionEndTime?: string;
  currentPrice?: number;
  reservePrice?: number;
  noReserve?: boolean;
  isDutchAuction?: boolean;
  highestBid?: number;
  highestBidderId?: string;
}

export function useAuctionState({
  auctionEndTime,
  currentPrice,
  reservePrice,
  noReserve,
  isDutchAuction,
  highestBid,
  highestBidderId
}: AuctionStateProps) {
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [hasWinner, setHasWinner] = useState(false);

  useEffect(() => {
    // Check if auction has ended either by time or by someone winning
    const isEnded = 
      (auctionEndTime && new Date(auctionEndTime) < new Date()) || 
      (isDutchAuction && !!highestBid && !!highestBidderId);
    
    setIsAuctionEnded(isEnded);
    setHasWinner(!!highestBid && !!highestBidderId);
  }, [auctionEndTime, isDutchAuction, highestBid, highestBidderId]);

  return {
    isAuctionEnded,
    hasWinner,
  };
}
