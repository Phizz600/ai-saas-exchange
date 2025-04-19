
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseBidCreationProps {
  productId: string;
  onValidationError?: (error: string) => void;
}

export function useBidCreation({ productId, onValidationError }: UseBidCreationProps) {
  const [isCreatingBid, setIsCreatingBid] = useState(false);
  const [bidId, setBidId] = useState<string | null>(null);

  const createBid = async (amount: number) => {
    try {
      setIsCreatingBid(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast("Authentication required", {
          description: "Please sign in to place a bid",
          variant: "destructive"
        });
        return null;
      }

      // Get the latest product data to verify the current price
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('highest_bid, current_price, reserve_price, listing_type')
        .eq('id', productId)
        .single();
        
      if (productError) {
        console.error('Error fetching product for validation:', productError);
        throw new Error("Could not verify current auction price");
      }
      
      // Check if this is a Dutch auction with existing winner
      if (product.listing_type === 'dutch_auction' && product.highest_bid) {
        throw new Error("This Dutch auction already has a winner");
      }

      // Create a pending bid
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (bidError) {
        console.error('Error creating bid:', bidError);
        throw bidError;
      }

      console.log('Bid created successfully:', bid);
      setBidId(bid.id);
      return bid.id;

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
    createBid,
    isCreatingBid,
    bidId
  };
}
