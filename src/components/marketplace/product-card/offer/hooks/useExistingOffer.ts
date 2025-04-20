
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useExistingOffer(productId: string) {
  const [existingOffer, setExistingOffer] = useState<any | null>(null);
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);

  useEffect(() => {
    const checkExistingOffer = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('product_id', productId)
          .eq('bidder_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setExistingOffer(data[0]);
          
          if (['pending'].includes(data[0].status)) {
            setIsUpdatingOffer(true);
          }
        }
      } catch (error) {
        console.error("Error checking existing offers:", error);
      }
    };
    
    checkExistingOffer();
  }, [productId]);

  return {
    existingOffer,
    isUpdatingOffer
  };
}
