
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaveProductProps {
  productId: string;
  initialSavedState?: boolean;
}

export function SaveProduct({ productId, initialSavedState = false }: SaveProductProps) {
  const [isSaved, setIsSaved] = useState(initialSavedState);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
        description: isSaved ? "Removed from saved products" : "Added to your saved products",
      });

    } catch (error) {
      console.error('Error toggling product save:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isSaved, isLoading, handleSaveClick };
}
