
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { useEffect, useState } from "react";

interface ValuationState {
  low: number;
  high: number;
}

export function useAuctionCalculations(form: UseFormReturn<ListProductFormData>) {
  const [valuation, setValuation] = useState<ValuationState>({
    low: 0,
    high: 0
  });
  const [recommendedDecrement, setRecommendedDecrement] = useState<number>(0);

  const monthlyRevenue = form.watch("monthlyRevenue");
  const isAuction = form.watch("isAuction");
  const startingPrice = form.watch("startingPrice");
  const reservePrice = form.watch("reservePrice");

  // Auto-set starting price based on monthly revenue
  useEffect(() => {
    if (monthlyRevenue && !form.getValues("startingPrice")) {
      const price = Math.max(1, monthlyRevenue * 10);
      form.setValue("startingPrice", price);
    }
  }, [monthlyRevenue, form]);

  // Auto-calculate reserve price as 60% of starting price
  useEffect(() => {
    if (startingPrice && isAuction && !form.getValues("reservePrice")) {
      const calculatedReserve = Math.max(1, Math.round(startingPrice * 0.6));
      form.setValue("reservePrice", calculatedReserve);
    }
  }, [startingPrice, isAuction, form]);

  // Helper function to calculate decrement divisor
  const calculateDecrementDivisor = (duration: string, interval: string) => {
    let baseDivisor: number;
    
    switch (duration) {
      case "14days": baseDivisor = 14; break;
      case "30days": baseDivisor = 30; break;
      case "60days": baseDivisor = 60; break;
      case "90days": baseDivisor = 90; break;
      default: baseDivisor = 30;
    }
    
    switch (interval) {
      case "day": return baseDivisor;
      case "week": return Math.ceil(baseDivisor / 7);
      case "month": return Math.ceil(baseDivisor / 30);
      default: return baseDivisor;
    }
  };

  // Calculate recommended decrement
  useEffect(() => {
    if (startingPrice && form.getValues("auctionDuration") && form.getValues("priceDecrementInterval")) {
      const duration = form.getValues("auctionDuration");
      const interval = form.getValues("priceDecrementInterval");
      const reservePriceValue = form.getValues("reservePrice") || 0;
      const priceDiff = startingPrice - reservePriceValue;
      
      const decrementDivisor = calculateDecrementDivisor(duration, interval);
      const recommended = Math.max(1, Math.round(priceDiff / decrementDivisor));
      setRecommendedDecrement(recommended);

      if (!form.getValues("priceDecrement")) {
        form.setValue("priceDecrement", recommended);
      }
    }
  }, [startingPrice, reservePrice, form, form.watch("auctionDuration"), form.watch("priceDecrementInterval")]);

  // Update noReserve flag
  useEffect(() => {
    if (reservePrice === 0) {
      form.setValue("noReserve", true);
    } else if (reservePrice !== undefined) {
      form.setValue("noReserve", false);
    }
  }, [reservePrice, form]);

  return {
    valuation,
    setValuation,
    recommendedDecrement,
    isAuction,
    startingPrice
  };
}
