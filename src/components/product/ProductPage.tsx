import { useState } from "react";
import { Share2, Timer, TrendingDown, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PriceHistoryChart } from "./sections/PriceHistoryChart";
import { ProductStats } from "./sections/ProductStats";
import { ProductGallery } from "./sections/ProductGallery";
import { ProductReviews } from "./sections/ProductReviews";
import { RelatedProducts } from "../marketplace/product-card/RelatedProducts";

interface ProductPageProps {
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
    demo_url?: string;
    seller: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

export function ProductPage({ product }: ProductPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Product link has been copied to your clipboard",
    });
  };

  const handleLike = async () => {
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

      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Product unliked" : "Product liked",
        description: isLiked ? "Removed from your liked products" : "Added to your liked products",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Could not update liked status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Product Image */}
        <div className="space-y-6">
          <ProductGallery images={[product.image]} />
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stage</span>
                <span className="font-medium">{product.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="font-medium">${product.monthlyRevenue.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Price Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-3xl font-bold">
                    ${product.current_price?.toLocaleString() || product.price.toLocaleString()}
                  </p>
                </div>
                {product.auction_end_time && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Timer className="h-4 w-4" />
                      <span>{product.timeLeft} left</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingDown className="h-4 w-4" />
                      <span>Drops ${product.price_decrement}/hour</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
                >
                  {product.auction_end_time ? "Place Bid" : "Buy Now"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      View Pitch Deck
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Pitch deck content */}
                  </DialogContent>
                </Dialog>
              </div>

              {product.demo_url && (
                <a 
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline mt-4"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Live Demo
                </a>
              )}
            </div>
          </Card>

          <ProductStats product={product} />
          <PriceHistoryChart productId={product.id} />
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <ProductReviews productId={product.id} />
        <RelatedProducts 
          currentProductCategory={product.category}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}