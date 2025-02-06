import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductStatsProps {
  product: {
    id: string;
    monthlyRevenue?: number;
  };
}

export function ProductStats({ product }: ProductStatsProps) {
  // Safely format the monthly revenue with a default of 0
  const formattedRevenue = product.monthlyRevenue 
    ? formatCurrency(product.monthlyRevenue)
    : '$0';

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Product Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Monthly Revenue</span>
          </div>
          <p className="text-xl font-semibold">{formattedRevenue}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Users className="h-4 w-4" />
            <span>Active Users</span>
          </div>
          <p className="text-xl font-semibold">2.5k</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Star className="h-4 w-4" />
            <span>Rating</span>
          </div>
          <p className="text-xl font-semibold">4.8/5</p>
        </div>
      </div>
    </Card>
  );
}