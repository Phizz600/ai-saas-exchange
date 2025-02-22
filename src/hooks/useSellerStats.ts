
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
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_analytics (
            views,
            bids
          )
        `)
        .eq('seller_id', user.id);

      if (error) {
        console.error('Error fetching seller stats:', error);
        throw error;
      }

      if (!products) return null;

      // Calculate total revenue from the seller's products
      const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);
      
      // Calculate total views and bids across all products
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
    retry: 1,
  });
};
