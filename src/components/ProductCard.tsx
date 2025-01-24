import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProductCardImage } from "./marketplace/product-card/ProductCardImage";
import { ProductCardContent } from "./marketplace/product-card/ProductCardContent";
import { ProductCardActions } from "./marketplace/product-card/ProductCardActions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductCardDialog } from "./marketplace/product-card/ProductCardDialog";

interface ProductCardProps {
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
    starting_price?: number;
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
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const isMobile = useIsMobile();

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!isMobile ? { y: -5 } : undefined}
      transition={{ duration: 0.2 }}
      className="group touch-manipulation"
    >
      <Card className="overflow-hidden bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-xl border-gray-100/50 shadow-lg">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="absolute top-2 right-14 z-10 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto">
            <ProductCardDialog product={product} />
          </DialogContent>
        </Dialog>

        <ProductCardImage
          image={product.image}
          title={product.title}
          timeLeft={product.timeLeft}
          seller={product.seller}
          isFavorited={isFavorited}
          onFavoriteClick={toggleFavorite}
        />
        <ProductCardContent
          title={product.title}
          description={product.description}
          price={product.price}
          category={product.category}
          stage={product.stage}
          monthlyRevenue={product.monthlyRevenue}
          isAuction={!!product.auction_end_time}
          currentPrice={product.current_price}
          minPrice={product.min_price}
          priceDecrement={product.price_decrement}
          auctionEndTime={product.auction_end_time}
        />
        <ProductCardActions product={product} />
      </Card>
    </motion.div>
  );
}