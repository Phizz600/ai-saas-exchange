import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "./StatsCard";
import { formatCurrency } from "@/lib/utils";

export const MarketplaceStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select(`
          *,
          product_analytics (
            views,
            likes
          )
        `)
        .eq('seller_id', user.id);

      if (!products) return null;

      // Calculate total revenue (sum of all product prices)
      const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);
      
      // Calculate total views and likes
      const analytics = products.reduce((acc, product) => {
        const productAnalytics = product.product_analytics?.[0] || { views: 0, likes: 0 };
        return {
          views: acc.views + (productAnalytics.views || 0),
          likes: acc.likes + (productAnalytics.likes || 0),
        };
      }, { views: 0, likes: 0 });

      return {
        totalRevenue,
        productCount: products.length,
        ...analytics,
      };
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats?.totalRevenue || 0)}
        change={{ value: 4, type: 'increase' }}
        subtitle="vs last month"
      />
      <StatsCard
        title="Total Products"
        value={stats?.productCount || 0}
        change={{ value: 2, type: 'increase' }}
        subtitle="vs last month"
      />
      <StatsCard
        title="Total Views"
        value={stats?.views || 0}
        change={{ value: 12, type: 'increase' }}
        subtitle="vs last month"
      />
      <StatsCard
        title="Total Likes"
        value={stats?.likes || 0}
        change={{ value: 8, type: 'increase' }}
        subtitle="vs last month"
      />
    </div>
  );
};