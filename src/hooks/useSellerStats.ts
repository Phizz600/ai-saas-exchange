
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SellerStats {
  totalExitValue: number;
  successfulExits: number;
  totalTransactionValue: number;
  averageExitValue: number;
  productCount: number;
  activeProductCount: number;
  views: number;
  totalBids: number;
  totalOffers: number;
  conversionRate: number;
  exitValueChange?: { value: number; type: 'increase' | 'decrease' };
  successfulExitsChange?: { value: number; type: 'increase' | 'decrease' };
  productCountChange?: { value: number; type: 'increase' | 'decrease' };
  viewsChange?: { value: number; type: 'increase' | 'decrease' };
  bidsChange?: { value: number; type: 'increase' | 'decrease' };
  conversionRateChange?: { value: number; type: 'increase' | 'decrease' };
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

      // Get escrow transactions (completed exits)
      const { data: completedEscrows } = await supabase
        .from('escrow_transactions')
        .select('amount, created_at')
        .eq('seller_id', user.id)
        .eq('status', 'completed');

      // Get all accepted offers (total transaction value)
      const { data: acceptedOffers } = await supabase
        .from('offers')
        .select('amount, product_id')
        .eq('status', 'accepted')
        .in('product_id', products?.map(p => p.id) || []);

      // Get offers data for conversion rate
      const { data: offers } = await supabase
        .from('offers')
        .select('id, product_id')
        .in('product_id', products?.map(p => p.id) || []);

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

      // Get last month's completed escrows
      const { data: lastMonthEscrows } = await supabase
        .from('escrow_transactions')
        .select('amount')
        .eq('seller_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      if (error) {
        console.error('Error fetching seller stats:', error);
        throw error;
      }

      if (!products) return null;

      // Calculate current month's metrics
      const totalExitValue = completedEscrows?.reduce((sum, escrow) => sum + (escrow.amount || 0), 0) || 0;
      const successfulExits = completedEscrows?.length || 0;
      const totalTransactionValue = acceptedOffers?.reduce((sum, offer) => sum + (offer.amount || 0), 0) || 0;
      const averageExitValue = successfulExits > 0 ? totalExitValue / successfulExits : 0;
      const productCount = products.length;
      const activeProductCount = products.filter(p => p.status === 'active').length;
      const totalOffers = offers?.length || 0;
      
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

      // Calculate derived metrics
      const conversionRate = analytics.views > 0 ? (totalOffers / analytics.views) * 100 : 0;

      // Calculate last month's metrics for comparison
      let lastMonthExitValue = 0;
      let lastMonthSuccessfulExits = 0;
      let lastMonthProductCount = 0;
      let lastMonthAnalytics = { views: 0, totalBids: 0 };

      if (lastMonthEscrows) {
        lastMonthExitValue = lastMonthEscrows.reduce((sum, escrow) => sum + (escrow.amount || 0), 0);
        lastMonthSuccessfulExits = lastMonthEscrows.length;
      }

      if (lastMonthProducts) {
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
        totalExitValue,
        successfulExits,
        totalTransactionValue,
        averageExitValue,
        productCount,
        activeProductCount,
        views: analytics.views,
        totalBids: analytics.totalBids,
        totalOffers,
        conversionRate,
        exitValueChange: calculateChange(totalExitValue, lastMonthExitValue),
        successfulExitsChange: calculateChange(successfulExits, lastMonthSuccessfulExits),
        productCountChange: calculateChange(productCount, lastMonthProductCount),
        viewsChange: calculateChange(analytics.views, lastMonthAnalytics.views),
        bidsChange: calculateChange(analytics.totalBids, lastMonthAnalytics.totalBids),
        conversionRateChange: calculateChange(conversionRate, 0), // Simplified for MVP
      };
    },
    retry: 1,
  });
};
