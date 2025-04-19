
import { useState } from "react";

interface UseBidValidationProps {
  currentPrice?: number;
  highestBid: number | null;
  onValidationError?: (error: string) => void;
}

export function useBidValidation({ 
  currentPrice, 
  highestBid, 
  onValidationError 
}: UseBidValidationProps) {
  const [bidError, setBidError] = useState<string | null>(null);

  const validateBid = (amount: string): boolean => {
    setBidError(null);
    
    const numericAmount = parseFloat(amount);
    console.log("Validating bid amount:", numericAmount, "against highest bid:", highestBid, "or current price:", currentPrice);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      const errorMsg = "Please enter a valid amount for your bid.";
      setBidError(errorMsg);
      if (onValidationError) onValidationError(errorMsg);
      return false;
    }

    if (highestBid && numericAmount <= highestBid) {
      const errorMsg = `Your bid must be higher than the current highest bid of $${highestBid.toLocaleString()}`;
      setBidError(errorMsg);
      if (onValidationError) onValidationError(errorMsg);
      return false;
    } 
    else if (!highestBid && currentPrice && numericAmount < currentPrice) {
      const errorMsg = `Your bid must be at least the current price of $${currentPrice.toLocaleString()}`;
      setBidError(errorMsg);
      if (onValidationError) onValidationError(errorMsg);
      return false;
    }
    
    return true;
  };

  const clearBidError = () => {
    setBidError(null);
  };

  return {
    bidError,
    validateBid,
    clearBidError
  };
}
