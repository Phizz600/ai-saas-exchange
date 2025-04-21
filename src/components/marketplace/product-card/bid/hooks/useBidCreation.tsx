
import { useState } from "react";
import { createBid } from "../services/bid-service";

interface UseBidCreationProps {
  productId: string;
  onValidationError?: (error: string) => void;
}

export function useBidCreation({ productId, onValidationError }: UseBidCreationProps) {
  const [isCreatingBid, setIsCreatingBid] = useState(false);
  const [bidId, setBidId] = useState<string | null>(null);

  const createBidHandler = async (amount: number) => {
    try {
      setIsCreatingBid(true);
      
      const newBidId = await createBid(productId, amount);
      
      setBidId(newBidId);
      return newBidId;

    } catch (err: any) {
      if (onValidationError) {
        onValidationError(err.message);
      }
      return null;
    } finally {
      setIsCreatingBid(false);
    }
  };

  return {
    createBid: createBidHandler,
    isCreatingBid,
    bidId
  };
}
