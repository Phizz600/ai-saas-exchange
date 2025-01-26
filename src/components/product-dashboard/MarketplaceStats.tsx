import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MarketplaceStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      console.log('Fetching marketplace stats');
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('category, monthly_revenue');

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Calculate stats
      const categories = products.reduce((acc: Record<string, number>, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      const totalRevenue = products.reduce((sum, product) => 
        sum + (product.monthly_revenue || 0), 0);

      return {
        totalProducts: products.length,
        categories,
        totalRevenue
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Package className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${stats?.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold">
              {Object.keys(stats?.categories || {}).length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};