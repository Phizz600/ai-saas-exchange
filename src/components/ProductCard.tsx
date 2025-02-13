
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, DollarSign, ShieldCheck, TrendingDown, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { incrementProductViews, incrementProductClicks } from "@/integrations/supabase/functions";
import { formatCurrency } from "@/lib/utils";

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
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('saved_products')
          .eq('id', user.id)
          .single();

        if (profile?.saved_products?.includes(product.id)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkIfSaved();
    incrementProductViews(product.id).catch(console.error);
  }, [product.id]);

  const handleCardClick = async () => {
    try {
      await incrementProductClicks(product.id);
    } catch (error) {
      console.error('Error tracking product click:', error);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save products",
          variant: "destructive",
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
        description: isSaved ? "Removed from saved products" : "Added to your saved products",
      });

    } catch (error) {
      console.error('Error toggling product save:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const growthRate = "30%"; // This would come from actual data
  const activeUsers = "2K"; // This would come from actual data

  return (
    <Link to={`/product/${product.id}`} onClick={handleCardClick}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.auction_end_time && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Dutch Auction
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-exo text-xl font-semibold text-gray-900 mb-2">
                {product.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {product.stage}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{growthRate} MoM Growth</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span>{formatCurrency(product.monthlyRevenue)} MRR</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Revenue Verified</span>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  onView?.();
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Make an Offer
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
