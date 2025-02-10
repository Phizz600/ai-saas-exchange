
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductCardDialog } from "./ProductCardDialog";

interface ProductCardHeaderProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stage: string;
    monthlyRevenue: number;
    image: string;
    timeLeft: string;
    auction_end_time?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
    seller: {
      id: string;
      name: string;
      avatar: string;
      achievements: {
        type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
        label: string;
      }[];
    };
  };
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onView?: () => void;
}

export function ProductCardHeader({ 
  product, 
  isDialogOpen, 
  onDialogOpenChange, 
  onView 
}: ProductCardHeaderProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="absolute top-2 right-14 z-10 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20"
          onClick={(e) => e.preventDefault()} 
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-4 sm:mx-auto">
        <ProductCardDialog product={product} />
      </DialogContent>
    </Dialog>
  );
}
