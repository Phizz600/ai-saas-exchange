
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuctionSection } from "./auction/AuctionSection";
import { OfferDialog } from "./offer/OfferDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuctionEnd } from "@/hooks/useAuctionEnd";

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
    reserve_price?: number;
    investment_timeline?: string;
  };
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

  // Fetch the conversation if auction has ended
  useEffect(() => {
    if (auctionEnded) {
      const fetchConversation = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('conversations')
            .select('id')
            .eq('product_id', product.id)
            .eq('transaction_type', 'auction')
            .single();

          if (data && !error) {
            setConversationId(data.id);
          }
        } catch (error) {
          console.error("Error fetching conversation:", error);
        }
      };

      fetchConversation();
    }
  }, [auctionEnded, product.id]);

  // Use the auction end hook to trigger escrow proposal creation
  useAuctionEnd({
    auctionEndTime: product.auction_end_time,
    productId: product.id,
    conversationId,
    currentPrice: product.current_price,
    productTitle: product.title
  });

  return (
    <CardFooter className="flex flex-col gap-3">
      {isAuction && !auctionEnded && <AuctionSection product={product} />}

      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {isAuction ? "Make Offer / Bid" : "Make an Offer"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <OfferDialog 
            productId={product.id}
            productTitle={product.title}
            isAuction={isAuction}
            currentPrice={product.current_price}
            onClose={() => setIsOfferDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}
