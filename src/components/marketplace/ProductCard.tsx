
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Timer, Heart, Bookmark, TrendingDown, CheckCircle, DollarSign, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { EditProductDialog } from "./product-card/EditProductDialog";
import { motion } from "framer-motion";

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
    is_revenue_verified?: boolean;
    is_code_audited?: boolean;
    is_traffic_verified?: boolean;
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
  const [isSaved, setIsSaved] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;

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

  // Check if user has saved or favorited this product
  useEffect(() => {
    const checkUserInteractions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('liked_products, saved_products')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsFavorited(profile.liked_products?.includes(product.id) || false);
          setIsSaved(profile.saved_products?.includes(product.id) || false);
        }
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };

    checkUserInteractions();
  }, [product.id]);

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

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save products",
          variant: "destructive"
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('saved_products')
        .eq('id', user.id)
        .single();

      const currentSaves = profile?.saved_products || [];
      const newSaves = isSaved
        ? currentSaves.filter((id: string) => id !== product.id)
        : [...currentSaves, product.id];

      await supabase
        .from('profiles')
        .update({ 
          saved_products: newSaves,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Product unsaved" : "Product saved",
        description: isSaved ? "Removed from your saved products" : "Added to your saved products",
      });
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getCategoryColor = (category: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Content Generation': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Customer Service': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Image Generation': { bg: 'bg-pink-100', text: 'text-pink-700' },
      'Development Tools': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      'Audio Processing': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      'Video Processing': { bg: 'bg-rose-100', text: 'text-rose-700' },
      'Finance': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
    };
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const getStageColor = (stage: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Revenue': { bg: 'bg-green-100', text: 'text-green-700' },
      'MVP': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Prototype': { bg: 'bg-amber-100', text: 'text-amber-700' },
      'Idea': { bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    return colors[stage] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  return (
    <>
      <Link to={`/product/${product.id}`} className="group">
        <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-gray-100/50 group-hover:border-blue-100/50 relative bg-white backdrop-blur-sm">
          {/* Product Image with Loading State */}
          <div className="relative h-48 overflow-hidden">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-2 right-2 flex gap-0.5">
              {showEditButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white bg-black/20 hover:bg-black/30 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white bg-black/20 hover:bg-black/30 hover:text-white ${
                  isSaved ? "text-primary" : ""
                }`}
                onClick={toggleSave}
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`text-white bg-black/20 hover:bg-black/30 hover:text-white ${
                  isFavorited ? "text-red-500" : ""
                }`}
                onClick={toggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
            </div>
            
            {isAuction && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="bg-amber-500/90 text-white border-0 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-1" />
                  Dutch Auction
                </Badge>
              </div>
            )}
            
            {isAuction && timeLeft && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-amber-50 border-0">
                  <Timer className="w-3.5 h-3.5 mr-1" />
                  {timeLeft}
                </Badge>
              </div>
            )}
          </div>

          {/* Product Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1 group-hover:text-[#8B5CF6] transition-colors duration-200 exo-2-heading">
              {product.title}
            </h3>
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            )}

            <div className="space-y-3">
              {/* Price Display */}
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-green-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-0.5" />
                  {isAuction
                    ? formatCurrency(product.current_price || product.price || 0).replace('$', '')
                    : formatCurrency(product.price || 0).replace('$', '')}
                </span>
                {isAuction && product.min_price && (
                  <span className="text-sm text-gray-500">
                    (Min: {formatCurrency(product.min_price).replace('$', '')})
                  </span>
                )}
              </div>

              {/* Stats */}
              {product.monthlyRevenue !== undefined && product.monthlyRevenue > 0 && (
                <div className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-500" />
                  MRR: {formatCurrency(product.monthlyRevenue)}
                </div>
              )}

              {/* Category and Stage */}
              <div className="flex flex-wrap gap-2 pt-2">
                {product.category && (
                  <Badge 
                    variant="outline" 
                    className={`${getCategoryColor(product.category).bg} ${getCategoryColor(product.category).text} border-0`}
                  >
                    {product.category}
                  </Badge>
                )}
                {product.stage && (
                  <Badge 
                    variant="outline" 
                    className={`${getStageColor(product.stage).bg} ${getStageColor(product.stage).text} border-0`}
                  >
                    {product.stage}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Verification Badge - only show if product is verified */}
          {isVerified && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-green-500/90 text-white border-0 flex items-center">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Verified
              </Badge>
            </div>
          )}
          
          {/* Action Button in Footer */}
          <div className="p-4 pt-0">
            <Button 
              className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all mt-4"
            >
              {isAuction ? "Make Offer / Bid" : "Make an Offer"}
            </Button>
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
