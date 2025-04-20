
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSaveProduct(productId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('saved_products')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.saved_products?.includes(productId)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedStatus();
  }, [productId]);

  const toggleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
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
        .maybeSingle();

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

  return { isSaved, isLoading, toggleSave };
}
