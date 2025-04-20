
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

    // Must be higher than highest bid or current price
    const minimumPrice = highestBid || currentPrice || 0;
    if (numericAmount <= minimumPrice) {
      const errorMsg = `Your bid must be higher than ${highestBid ? 'the current highest bid' : 'the current price'} of $${minimumPrice.toLocaleString()}`;
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
