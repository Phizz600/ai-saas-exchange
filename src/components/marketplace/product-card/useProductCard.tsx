
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProductCard(productId: string) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { toast } = useToast();

  // Check if user has favorited or saved the product
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
          setIsFavorited((profile.liked_products || []).includes(productId));
          setIsSaved((profile.saved_products || []).includes(productId));
        }
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };

    checkUserInteractions();
  }, [productId]);

  // Calculate time left for auction
  useEffect(() => {
    if (!productId) return;
    
    // Add auction timer logic if needed
    // This would be implemented here if we had auction end time data
    
  }, [productId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to favorite products",
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
        ? currentLikes.filter((id: string) => id !== productId)
        : [...currentLikes, productId];

      await supabase
        .from('profiles')
        .update({ 
          liked_products: newLikes,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Product unfavorited" : "Product favorited",
        description: isFavorited ? "Removed from your favorites" : "Added to your favorites",
      });

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
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
        ? currentSaves.filter((id: string) => id !== productId)
        : [...currentSaves, productId];

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
        variant: "destructive",
      });
    }
  };

  return {
    isImageLoaded,
    setIsImageLoaded,
    isFavorited,
    isSaved,
    timeLeft,
    setTimeLeft,
    toggleFavorite,
    toggleSave
  };
}
