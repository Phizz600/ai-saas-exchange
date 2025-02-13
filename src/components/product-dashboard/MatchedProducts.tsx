
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { X, Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const MatchedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: viewsData } = useQuery({
    queryKey: ['daily-views-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: viewCount } = await supabase.rpc('get_daily_views_count', {
        user_uuid: user.id
      });
      
      return viewCount || 0;
    }
  });

  const { data: matches, isLoading } = useQuery({
    queryKey: ['matched-products', currentIndex],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get matched products not yet viewed today
      const { data: matchedProducts } = await supabase
        .from('matched_products')
        .select('*')
        .eq('investor_id', user.id)
        .order('match_score', { ascending: false })
        .limit(10);

      if (!matchedProducts) return [];

      // Filter out products already viewed today
      const { data: viewedToday } = await supabase
        .from('daily_product_views')
        .select('product_id')
        .eq('user_id', user.id)
        .gte('viewed_at', new Date().toISOString().split('T')[0]);

      const viewedIds = new Set((viewedToday || []).map(v => v.product_id));
      return matchedProducts.filter(m => !viewedIds.has(m.product_id));
    }
  });

  const handleAction = async (action: 'skip' | 'like', productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Record the view
      await supabase.from('daily_product_views').insert({
        user_id: user.id,
        product_id: productId,
        action
      });

      // Move to next card
      setCurrentIndex(prev => prev + 1);

      if (action === 'like') {
        // Open product page in new tab
        window.open(`/product/${productId}`, '_blank');
      }
    } catch (error) {
      console.error('Error recording action:', error);
      toast({
        title: "Error",
        description: "Failed to record your action. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
    );
  }

  if (!matches || matches.length === 0 || currentIndex >= matches.length || viewsData >= 10) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-2 font-exo">No More Matches Today</h3>
        <p className="text-gray-500 mb-6">
          You've reached your daily limit or viewed all available matches. 
          Come back tomorrow to see new matches!
        </p>
        <Button
          className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:opacity-90 text-white"
          onClick={() => navigate('/marketplace')}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Marketplace
        </Button>
      </Card>
    );
  }

  const currentMatch = matches[currentIndex];

  return (
    <div className="relative mt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
        <span className="inline-block bg-[#9b87f5] text-white px-6 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1}/{matches.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMatch.product_id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white px-3 py-1 rounded-full text-sm font-medium">
              {Math.round(currentMatch.match_score)}% Match
            </span>
          </div>
          <ProductCard
            product={{
              id: currentMatch.product_id,
              title: currentMatch.title,
              description: currentMatch.description || "",
              price: Number(currentMatch.price),
              category: currentMatch.category,
              stage: currentMatch.stage,
              monthlyRevenue: 0,
              image: currentMatch.image_url || "/placeholder.svg",
              timeLeft: "24h left",
              seller: {
                id: "",
                name: "Anonymous",
                avatar: "/placeholder.svg",
                achievements: []
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full p-6"
          onClick={() => handleAction('skip', currentMatch.product_id)}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full p-6"
          onClick={() => handleAction('like', currentMatch.product_id)}
        >
          <Check className="h-6 w-6 text-green-500" />
        </Button>
      </div>
    </div>
  );
};
