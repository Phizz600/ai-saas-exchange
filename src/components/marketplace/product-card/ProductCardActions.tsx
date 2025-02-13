
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuctionSection } from "./auction/AuctionSection";
import { OfferDialog } from "./offer/OfferDialog";
import { useState } from "react";
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
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

  return (
    <CardFooter className="flex flex-col gap-3">
      {isAuction && !auctionEnded && <AuctionSection product={product} />}

      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-white text-black hover:bg-gradient-to-r hover:from-[#D946EE] hover:via-[#8B5CF6] hover:to-[#0EA4E9] hover:text-white transition-all duration-300"
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
