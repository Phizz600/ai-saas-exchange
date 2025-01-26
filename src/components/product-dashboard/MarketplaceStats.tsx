import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  status: string;
  seller: {
    id: string;
    username: string;
  };
}

export const MarketplaceStats = () => {
  const { data: stats } = useQuery<Product[]>({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles(*)')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 font-exo">Marketplace Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <BarChart3 className="h-6 w-6 text-[#D946EE]" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{stats?.length || 0}</h3>
            <p className="text-sm text-gray-500">Active Listings</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <TrendingUp className="h-6 w-6 text-[#8B5CF6]" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">0</h3>
            <p className="text-sm text-gray-500">Sales Today</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Users className="h-6 w-6 text-[#0EA4E9]" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">0</h3>
            <p className="text-sm text-gray-500">Total Sellers</p>
          </div>
        </div>
      </div>
    </Card>
  );
};