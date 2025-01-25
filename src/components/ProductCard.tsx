import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  onView?: () => void;
}

export function ProductCard({ product, onView }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('liked_products')
        .eq('id', user.id)
        .single();

      if (profile?.liked_products?.includes(product.id)) {
        setIsFavorited(true);
      }
    };

    checkIfLiked();
  }, [product.id]);

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like products",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('liked_products')
        .eq('id', user.id)
        .single();

      const currentLikes = profile?.liked_products || [];
      const newLikes = isFavorited
        ? currentLikes.filter((id: string) => id !== product.id)
        : [...currentLikes, product.id];

      const { error } = await supabase
        .from('profiles')
        .update({ liked_products: newLikes })
        .eq('id', user.id);

      if (error) throw error;

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Product unliked" : "Product liked",
        description: isFavorited ? "Removed from your liked products" : "Added to your liked products",
      });

      console.log('Product like toggled:', {
        productId: product.id,
        userId: user.id,
        action: isFavorited ? 'unliked' : 'liked'
      });

    } catch (error) {
      console.error('Error toggling product like:', error);
      toast({
        title: "Error",
        description: "Failed to update liked products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open && onView) {
      onView();
    }
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
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
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