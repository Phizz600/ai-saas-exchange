
import { useState, useEffect } from "react";
import { incrementProductViews } from "@/integrations/supabase/product-analytics";
import { ProductWithSeller, MarketplaceProduct } from "@/types/marketplace";

export const useProductViewTracking = (
  products: ProductWithSeller[] | MarketplaceProduct[] | undefined, 
  isLoading: boolean
) => {
  const [viewTracked, setViewTracked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!products || isLoading) return;

    const trackProductViews = async () => {
      const newProductsToTrack = products.filter(product => !viewTracked.has(product.id));
      
      if (newProductsToTrack.length === 0) return;
      
      const newTrackedSet = new Set(viewTracked);
      
      for (const product of newProductsToTrack) {
        try {
          await incrementProductViews(product.id);
          newTrackedSet.add(product.id);
          console.log('Product view/impression tracked:', product.id);
        } catch (error) {
          console.error('Error tracking product impression:', error);
        }
      }
      
      setViewTracked(newTrackedSet);
    };

    trackProductViews();
  }, [products, isLoading, viewTracked]);
};
