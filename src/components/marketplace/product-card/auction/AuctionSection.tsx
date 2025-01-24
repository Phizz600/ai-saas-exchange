import { Timer, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuctionSectionProps {
  product: {
    id: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
    auction_end_time?: string;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const auctionEnded = product.auction_end_time && new Date(product.auction_end_time) < new Date();

  const handleBid = async () => {
    if (!product.current_price) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to place a bid",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('bids')
        .insert({
          product_id: product.id,
          bidder_id: user.id,
          amount: product.current_price
        });

      if (error) throw error;

      toast({
        title: "Bid placed successfully!",
        description: `You've placed a bid for $${product.current_price.toLocaleString()}`,
      });

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error placing bid",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-purple-900">Dutch Auction</span>
        </div>
        {!auctionEnded && (
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Price</span>
          <span className="text-lg font-bold text-purple-600">
            ${product.current_price?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Min Price</span>
          <span className="font-medium text-gray-900">
            ${product.min_price?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Price Drop</span>
          <div className="flex items-center gap-1 text-amber-600">
            <DollarSign className="h-3 w-3" />
            <span>{product.price_decrement?.toLocaleString()}/min</span>
          </div>
        </div>
      </div>

      {!auctionEnded && (
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          onClick={handleBid}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing bid..." : "Place Bid"}
        </Button>
      )}
    </div>
  );
}