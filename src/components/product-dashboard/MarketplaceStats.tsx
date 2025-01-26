import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MarketplaceStats = () => {
  const { data: stats } = useQuery(['marketplace-stats'], async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, seller:profiles(*)')
      .eq('status', 'active');

    if (error) throw error;

    return data;
  });

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Marketplace Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <BarChart3 className="h-6 w-6 text-gray-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{stats?.length || 0}</h3>
            <p className="text-sm text-gray-500">Active Listings</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <TrendingUp className="h-6 w-6 text-gray-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">0</h3>
            <p className="text-sm text-gray-500">Sales Today</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <Users className="h-6 w-6 text-gray-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">0</h3>
            <p className="text-sm text-gray-500">Total Sellers</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
