
import { useState } from "react";

export function useBidAmountFormat() {
  const [bidAmount, setBidAmount] = useState("");
  const [formattedBidAmount, setFormattedBidAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.replace(/\./g, (match, index, string) => {
        return index === string.indexOf('.') ? '.' : '';
      });
    }
    
    // Limit to 2 decimal places
    if (value.includes('.')) {
      const parts = value.split('.');
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    
    setBidAmount(value);
    
    // Format for display
    if (value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setFormattedBidAmount(`$${numericValue.toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`);
      } else {
        setFormattedBidAmount("");
      }
    } else {
      setFormattedBidAmount("");
    }
  };

  const resetAmount = () => {
    setBidAmount("");
    setFormattedBidAmount("");
  };

  return {
    bidAmount,
    formattedBidAmount,
    handleAmountChange,
    resetAmount
  };
}
