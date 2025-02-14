
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Timer, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { EditProductDialog } from "./product-card/EditProductDialog";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price?: number;
    category?: string;
    stage?: string;
    monthlyRevenue?: number;
    image?: string;
    auction_end_time?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
    seller: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  showEditButton?: boolean;
}

export function ProductCard({ product, showEditButton = false }: ProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;

  useEffect(() => {
    if (!product.auction_end_time) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.auction_end_time!).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [product.auction_end_time]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to favorite products",
          variant: "destructive"
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

      await supabase
        .from('profiles')
        .update({ 
          liked_products: newLikes,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Product removed from your favorites" : "Product added to your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 relative group">
          {/* Product Image */}
          <div className="relative h-48">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {showEditButton && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                className={`bg-white/90 hover:bg-white ${
                  isFavorited ? "text-red-500" : ""
                }`}
                onClick={toggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
            </div>
            {isAuction && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  <Timer className="w-4 h-4 mr-1" />
                  {timeLeft}
                </Badge>
              </div>
            )}
          </div>

          {/* Product Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            )}

            <div className="space-y-2">
              {/* Price Display */}
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-green-600">
                  {isAuction
                    ? formatCurrency(product.current_price || product.price || 0)
                    : formatCurrency(product.price || 0)}
                </span>
                {isAuction && product.min_price && (
                  <span className="text-sm text-gray-500">
                    (Min: {formatCurrency(product.min_price)})
                  </span>
                )}
              </div>

              {/* Category and Stage */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {product.category}
                  </Badge>
                )}
                {product.stage && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {product.stage}
                  </Badge>
                )}
              </div>

              {/* Monthly Revenue */}
              {product.monthlyRevenue !== undefined && product.monthlyRevenue > 0 && (
                <div className="text-sm text-gray-600">
                  Monthly Revenue: {formatCurrency(product.monthlyRevenue)}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>

      {/* Edit Dialog */}
      <EditProductDialog
        product={product}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}
