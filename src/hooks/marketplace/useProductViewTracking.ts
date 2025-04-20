
import { useState, useEffect } from "react";
import { incrementProductViews } from "@/integrations/supabase/product-analytics";
import { ProductWithSeller, MarketplaceProduct } from "@/types/marketplace";

export const useProductViewTracking = (
  products: ProductWithSeller[] | MarketplaceProduct[] | undefined, 
  isLoading: boolean
) => {
  const [viewTracked, setViewTracked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!products || isLoading) {
      console.log('Skipping view tracking - products not ready or loading');
      return;
    }

    const trackProductViews = async () => {
      console.log('Starting view tracking for products:', products.length);
      
      const newProductsToTrack = products.filter(product => !viewTracked.has(product.id));
      console.log('New products to track:', newProductsToTrack.length);
      
      if (newProductsToTrack.length === 0) return;
      
      const newTrackedSet = new Set(viewTracked);
      
      for (const product of newProductsToTrack) {
        try {
          await incrementProductViews(product.id);
          newTrackedSet.add(product.id);
          console.log('Product view tracked:', {
            productId: product.id,
            title: product.title
          });
        } catch (error) {
          console.error('Error tracking product view:', {
            productId: product.id,
            error
          });
        }
      }
      
      setViewTracked(newTrackedSet);
      console.log('View tracking complete. Total tracked:', newTrackedSet.size);
    };

    trackProductViews();
  }, [products, isLoading, viewTracked]);
};
