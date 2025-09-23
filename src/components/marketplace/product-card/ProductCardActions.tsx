
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OfferDialog } from "./offer/OfferDialog";
import { useState } from "react";

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
    investment_timeline?: string;
  };
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  return (
    <CardFooter className="flex flex-col gap-3">
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Make an Offer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <OfferDialog 
            productId={product.id}
            productTitle={product.title}
            isAuction={false}
            currentPrice={product.price}
            onClose={() => setIsOfferDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}
