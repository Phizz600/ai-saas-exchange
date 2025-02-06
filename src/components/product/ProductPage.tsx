import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }

        console.log('Fetched product:', data);
        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

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
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link copied!",
                    description: "Product link has been copied to your clipboard",
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={async () => {
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
                }}
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
