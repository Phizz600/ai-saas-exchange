import { MessageSquare, Eye, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuctionSection } from "./auction/AuctionSection";
import { PitchDeckSlideshow } from "./pitch-deck/PitchDeckSlideshow";

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
  const isAuction = !!product.auction_end_time;

  return (
    <CardFooter className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline"
          className="w-full hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button 
          variant="outline"
          className="w-full hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Button>
      </div>

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
    </CardFooter>
  );
}