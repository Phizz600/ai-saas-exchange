import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Timer, Heart, Bookmark, TrendingDown, CheckCircle, DollarSign, Users, Star, Clock, User, Shield } from "lucide-react";
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
    monthly_profit?: number;
    gross_profit_margin?: number;
    monthly_churn_rate?: number;
    monthly_traffic?: number;
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
          {/* Product Image with Loading State and Blue Gradient Background */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#13293D] to-[#18435A]">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-700/40 animate-pulse" />
            )}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 ${
                isImageLoaded ? 'opacity-60' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            
            {/* Verification Data Metrics */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-4 z-20">
              <div className="w-full flex justify-around text-white">
                {product.monthlyRevenue !== undefined && product.monthlyRevenue > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold exo-2-heading">
                      ${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(product.monthlyRevenue)}
                    </div>
                    <div className="text-xs text-blue-200">Monthly Revenue</div>
                  </div>
                )}
                
                {product.monthly_traffic !== undefined && product.monthly_traffic > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold exo-2-heading">
                      {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(product.monthly_traffic)}
                    </div>
                    <div className="text-xs text-blue-200">Monthly Visitors</div>
                  </div>
                )}
                
                {product.gross_profit_margin !== undefined && product.gross_profit_margin > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold exo-2-heading">
                      {product.gross_profit_margin}%
                    </div>
                    <div className="text-xs text-blue-200">Profit Margin</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute top-2 right-2 flex gap-0.5 z-30">
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
              <div className="absolute bottom-2 left-2 z-30">
                <Badge variant="secondary" className="bg-amber-500/90 text-white border-0 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-1" />
                  Dutch Auction
                </Badge>
              </div>
            )}
            
            {isAuction && timeLeft && (
              <div className="absolute bottom-2 right-2 z-30">
                <Badge variant="secondary" className="bg-black/70 text-amber-50 border-0">
                  <Timer className="w-3.5 h-3.5 mr-1" />
                  {timeLeft}
                </Badge>
              </div>
            )}
            
            {/* Verification Badge - only show if product is verified */}
            {isVerified && (
              <div className="absolute top-2 left-2 z-30">
                <Badge variant="secondary" className="bg-green-500/90 text-white border-0 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Verified
                </Badge>
              </div>
            )}
          </div>

          {/* Product Content */}
          <div className="p-5 space-y-4">
            {/* Category & Stage Pills at the top */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <Badge 
                  variant="outline" 
                  className={`rounded-full px-4 py-1 ${getCategoryColor(product.category).bg} ${getCategoryColor(product.category).text} border-0`}
                >
                  {product.category}
                </Badge>
              )}
              {product.stage && (
                <Badge 
                  variant="outline" 
                  className={`rounded-full px-4 py-1 ${getStageColor(product.stage).bg} ${getStageColor(product.stage).text} border-0`}
                >
                  {product.stage}
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#8B5CF6] transition-colors duration-200 exo-2-heading">
              {product.title}
            </h3>
            
            {/* Price in green - making the font size smaller */}
            <div className="text-xl font-bold text-green-600">
              ${new Intl.NumberFormat('en-US').format((product.current_price || product.price || 0))}
            </div>
            
            {/* Metrics */}
            <div className="space-y-2">
              {/* MRR */}
              {product.monthlyRevenue !== undefined && product.monthlyRevenue > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">MRR: ${new Intl.NumberFormat('en-US').format(product.monthlyRevenue)}</span>
                </div>
              )}
              
              {/* Monthly visitors */}
              {product.monthly_traffic !== undefined && product.monthly_traffic > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600">
                    {new Intl.NumberFormat('en-US').format(product.monthly_traffic)} monthly visitors
                  </span>
                </div>
              )}
              
              {/* Profit Margin */}
              {product.gross_profit_margin !== undefined && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-gray-600">
                    {product.gross_profit_margin}% profit margin
                  </span>
                </div>
              )}
              
              {/* Churn Rate */}
              {product.monthly_churn_rate !== undefined && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">
                    {product.monthly_churn_rate}% monthly churn
                  </span>
                </div>
              )}
            </div>
            
            {/* Verification Badges */}
            <div className="flex flex-wrap gap-1.5">
              {product.is_revenue_verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  <Shield className="w-3 h-3 mr-1" /> Revenue Verified
                </Badge>
              )}
              {product.is_code_audited && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" /> Code Audited
                </Badge>
              )}
              {product.is_traffic_verified && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  <Users className="w-3 h-3 mr-1" /> Traffic Verified
                </Badge>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-5 pt-0 space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              {isAuction ? "Bid Now" : "Buy"}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
            >
              Make an Offer
            </Button>
            
            <Button 
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700 font-medium"
            >
              View Details
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
