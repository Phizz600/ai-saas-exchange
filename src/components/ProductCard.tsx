import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProductCardImage } from "./marketplace/product-card/ProductCardImage";
import { ProductCardContent } from "./marketplace/product-card/ProductCardContent";
import { ProductCardActions } from "./marketplace/product-card/ProductCardActions";
import { RelatedProducts } from "./marketplace/product-card/RelatedProducts";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Shield, AlertCircle, Timer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

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
        description: `You've placed a bid for ${product.current_price}`,
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

  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

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
            <div className="grid gap-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{product.title}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {isAuction ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Current Price</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">
                          ${product.current_price?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Min Price: ${product.min_price?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time Left</p>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Timer className="h-4 w-4" />
                          <p>{auctionEnded ? "Auction ended" : product.timeLeft}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Price drops: ${product.price_decrement?.toLocaleString()}/min
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-xl sm:text-2xl font-bold">${product.price.toLocaleString()}</p>
                      </div>
                      {product.stage === "Revenue" && (
                        <div>
                          <p className="text-sm text-gray-500">Monthly Revenue</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-600">
                            ${product.monthlyRevenue.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {isAuction && !auctionEnded && (
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
                    onClick={handleBid}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Placing bid..." : "Place Bid"}
                  </Button>
                )}
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  This transaction is protected by our Secure Purchase Program. 
                  Payment is held in escrow until both parties confirm the transfer is complete.
                </AlertDescription>
              </Alert>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Always communicate and complete transactions through our platform 
                  for your security. Report suspicious behavior immediately.
                </AlertDescription>
              </Alert>

              <RelatedProducts 
                currentProductCategory={product.category}
                currentProductId={product.id}
              />
            </div>
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
          isAuction={isAuction}
          currentPrice={product.current_price}
          minPrice={product.min_price}
          priceDecrement={product.price_decrement}
          auctionEndTime={product.auction_end_time}
        />
        <ProductCardActions />
      </Card>
    </motion.div>
  );
}