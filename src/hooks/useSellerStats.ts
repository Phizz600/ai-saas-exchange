
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SellerStats {
  totalRevenue: number;
  productCount: number;
  views: number;
  totalBids: number;
  revenueChange?: { value: number; type: 'increase' | 'decrease' };
  productCountChange?: { value: number; type: 'increase' | 'decrease' };
  viewsChange?: { value: number; type: 'increase' | 'decrease' };
  bidsChange?: { value: number; type: 'increase' | 'decrease' };
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

      // Get current month's data
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_analytics (
            views,
            bids,
            date
          )
        `)
        .eq('seller_id', user.id);

      // Get last month's data for comparison
      const lastMonthStart = new Date();
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      lastMonthStart.setDate(1);
      const lastMonthEnd = new Date();
      lastMonthEnd.setDate(0);

      const { data: lastMonthProducts } = await supabase
        .from('products')
        .select(`
          *,
          product_analytics!inner (
            views,
            bids,
            date
          )
        `)
        .eq('seller_id', user.id)
        .gte('product_analytics.date', lastMonthStart.toISOString().split('T')[0])
        .lte('product_analytics.date', lastMonthEnd.toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching seller stats:', error);
        throw error;
      }

      if (!products) return null;

      // Calculate current month's metrics
      const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);
      const productCount = products.length;
      
      // Calculate current month's analytics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const analytics = products.reduce((acc, product) => {
        // Filter analytics for this month
        const thisMonthAnalytics = product.product_analytics?.filter(a => {
          const analyticsDate = new Date(a.date);
          return analyticsDate.getMonth() === currentMonth && analyticsDate.getFullYear() === currentYear;
        }) || [];
        
        const monthlyViews = thisMonthAnalytics.reduce((sum, a) => sum + (a.views || 0), 0);
        const monthlyBids = thisMonthAnalytics.reduce((sum, a) => sum + (a.bids || 0), 0);
        
        return {
          views: acc.views + monthlyViews,
          totalBids: acc.totalBids + monthlyBids,
        };
      }, { views: 0, totalBids: 0 });

      // Calculate last month's metrics for comparison
      let lastMonthRevenue = 0;
      let lastMonthProductCount = 0;
      let lastMonthAnalytics = { views: 0, totalBids: 0 };

      if (lastMonthProducts) {
        lastMonthRevenue = lastMonthProducts.reduce((sum, product) => sum + (product.price || 0), 0);
        lastMonthProductCount = lastMonthProducts.filter(p => {
          const createdDate = new Date(p.created_at);
          return createdDate <= lastMonthEnd;
        }).length;

        lastMonthAnalytics = lastMonthProducts.reduce((acc, product) => {
          const monthlyViews = product.product_analytics?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
          const monthlyBids = product.product_analytics?.reduce((sum, a) => sum + (a.bids || 0), 0) || 0;
          
          return {
            views: acc.views + monthlyViews,
            totalBids: acc.totalBids + monthlyBids,
          };
        }, { views: 0, totalBids: 0 });
      }

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? { value: 100, type: 'increase' as const } : undefined;
        const percentage = Math.round(((current - previous) / previous) * 100);
        return {
          value: Math.abs(percentage),
          type: percentage >= 0 ? 'increase' as const : 'decrease' as const
        };
      };

      return {
        totalRevenue,
        productCount,
        views: analytics.views,
        totalBids: analytics.totalBids,
        revenueChange: calculateChange(totalRevenue, lastMonthRevenue),
        productCountChange: calculateChange(productCount, lastMonthProductCount),
        viewsChange: calculateChange(analytics.views, lastMonthAnalytics.views),
        bidsChange: calculateChange(analytics.totalBids, lastMonthAnalytics.totalBids),
      };
    },
    retry: 1,
  });
};
