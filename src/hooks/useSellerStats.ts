import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SellerStats {
  totalRevenue: number;
  productCount: number;
  views: number;
  totalBids: number;
}

export const useSellerStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<SellerStats | null> => {
      console.log('Fetching seller dashboard stats');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: products } = await supabase
        .from('products')
        .select(`
          *,
          product_analytics (
            views,
            bids
          )
        `)
        .eq('seller_id', user.id);

      if (!products) return null;

      const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);
      
      const analytics = products.reduce((acc, product) => {
        const productAnalytics = product.product_analytics?.[0] || { views: 0, bids: 0 };
        return {
          views: acc.views + (productAnalytics.views || 0),
          totalBids: acc.totalBids + (productAnalytics.bids || 0),
        };
      }, { views: 0, totalBids: 0 });

      return {
        totalRevenue,
        productCount: products.length,
        ...analytics,
      };
    },
  });
};