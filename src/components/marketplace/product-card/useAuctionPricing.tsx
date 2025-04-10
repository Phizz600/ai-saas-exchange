
import { useState, useEffect } from "react";
import { calculateCurrentAuctionPrice } from "@/integrations/supabase/auction";
import { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

export function useAuctionPricing(product: {
  auction_end_time?: string;
  starting_price?: number;
  current_price?: number;
  reserve_price?: number; // Changed from min_price to reserve_price
  price_decrement?: number;
  price_decrement_interval?: string;
  created_at: string;
  no_reserve?: boolean; // Added no_reserve field
}) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(product.current_price || null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  
  useEffect(() => {
    if (!product.auction_end_time) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.auction_end_time!).getTime();
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
    };

    // Calculate the initial time left
    calculateTimeLeft();
    
    // Also calculate the current price if it's a Dutch auction
    const updateCurrentPrice = () => {
      if (
        product.starting_price !== undefined &&
        product.reserve_price !== undefined && // Changed from min_price to reserve_price
        product.price_decrement !== undefined &&
        product.price_decrement_interval !== undefined &&
        product.created_at !== undefined &&
        !isAuctionEnded
      ) {
        const calculatedPrice = calculateCurrentAuctionPrice(
          product.starting_price,
          product.reserve_price, // Changed from min_price to reserve_price
          product.price_decrement,
          product.price_decrement_interval,
          product.created_at
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
    product.reserve_price, // Changed from min_price to reserve_price
    product.price_decrement,
    product.price_decrement_interval,
    product.created_at,
    isAuctionEnded
  ]);

  return { 
    timeLeft, 
    currentPrice, 
    isAuctionEnded
  };
}
