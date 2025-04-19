
import { useState, useEffect } from "react";
import { calculateCurrentAuctionPrice } from "@/integrations/supabase/auction";
import { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

export function useAuctionPricing(product: {
  auction_end_time?: string;
  starting_price?: number;
  current_price?: number;
  reserve_price?: number;
  price_decrement?: number;
  price_decrement_interval?: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  no_reserve?: boolean;
  listing_type?: string;
  highest_bid?: number;
  highest_bidder_id?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(product.current_price || null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  
  useEffect(() => {
    // Use listing_type as the primary way to check if this is an auction
    const isAuction = product.listing_type === 'dutch_auction' || !!product.auction_end_time;
    const isDutchAuction = product.listing_type === 'dutch_auction' || 
      (!!product.price_decrement && !!product.price_decrement_interval);
    
    if (!isAuction || !product.auction_end_time) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.auction_end_time!).getTime();
      const difference = endTime - now;

      // For Dutch auctions, if there's a highest bid, the auction has ended
      // The first valid bid wins in Dutch auctions
      if (isDutchAuction && product.highest_bid && product.highest_bidder_id) {
        setTimeLeft("Auction ended - winner found");
        setIsAuctionEnded(true);
        return;
      }

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
    };

    // Calculate the initial time left
    calculateTimeLeft();
    
    // Also calculate the current price if it's a Dutch auction
    const updateCurrentPrice = () => {
      // Don't update price if auction has a winner or has ended
      if (isAuctionEnded || (isDutchAuction && product.highest_bid)) {
        // If there's a highest bid, use that as the final price
        if (product.highest_bid) {
          setCurrentPrice(product.highest_bid);
        }
        return;
      }
      
      if (
        product.starting_price !== undefined &&
        product.price_decrement !== undefined &&
        product.price_decrement_interval !== undefined &&
        product.created_at !== undefined
      ) {
        // Determine reserve price - treat it as 0 for no-reserve auctions
        const reservePrice = product.no_reserve || product.reserve_price === 0 ? 0 : (product.reserve_price || 0);
        
        // Use updated_at as the approval time if status is 'active'
        const approvalTime = product.status === 'active' ? product.updated_at : undefined;
        
        const calculatedPrice = calculateCurrentAuctionPrice(
          product.starting_price,
          reservePrice,
          product.price_decrement,
          product.price_decrement_interval,
          product.created_at,
          approvalTime
        );
        
        setCurrentPrice(calculatedPrice);
      }
    };
    
    // Update price initially
    updateCurrentPrice();
    
    // Set up intervals for updates
    const timeTimer = setInterval(calculateTimeLeft, 60000);  // Update time every minute
    const priceTimer = setInterval(updateCurrentPrice, 60000); // Update price every minute
    
    return () => {
      clearInterval(timeTimer);
      clearInterval(priceTimer);
    };
  }, [
    product.auction_end_time,
    product.starting_price,
    product.reserve_price,
    product.price_decrement,
    product.price_decrement_interval,
    product.created_at,
    product.updated_at,
    product.status,
    product.no_reserve,
    product.listing_type,
    product.highest_bid,
    product.highest_bidder_id,
    isAuctionEnded
  ]);

  return { 
    timeLeft, 
    currentPrice, 
    isAuctionEnded
  };
}
