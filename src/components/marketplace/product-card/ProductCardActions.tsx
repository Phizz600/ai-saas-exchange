import { Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuctionSection } from "./auction/AuctionSection";
import { PitchDeckSlideshow } from "./pitch-deck/PitchDeckSlideshow";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductCardActionsProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stage: string;
    monthlyRevenue?: number;
    image?: string;
    auction_end_time?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
  };
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

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

  const handleBuyNow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to make a purchase",
          variant: "destructive"
        });
        return;
      }

      // Here you would typically initiate the purchase process
      toast({
        title: "Starting purchase process",
        description: "You'll be redirected to complete your purchase",
      });

    } catch (error) {
      console.error('Error initiating purchase:', error);
      toast({
        title: "Error",
        description: "Could not initiate purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <CardFooter className="flex flex-col gap-3">
      {isAuction && !auctionEnded && (
        <Button 
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          onClick={handleBid}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing bid..." : `Bid Now - $${product.current_price?.toLocaleString()}`}
        </Button>
      )}

      {isAuction && <AuctionSection product={product} />}

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
          >
            <Presentation className="h-4 w-4 mr-2" />
            View Pitch Deck
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <PitchDeckSlideshow product={product} />
        </DialogContent>
      </Dialog>

      {!isAuction && (
        <Button 
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          onClick={handleBuyNow}
        >
          Buy Now - ${product.price?.toLocaleString()}
        </Button>
      )}
    </CardFooter>
  );
}