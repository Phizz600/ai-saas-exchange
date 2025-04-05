
import { DollarSign, Users, Star, Clock, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductMetricsProps {
  monthlyRevenue?: number;
  monthly_traffic?: number;
  gross_profit_margin?: number;
  monthly_churn_rate?: number;
  is_revenue_verified?: boolean;
  is_code_audited?: boolean;
  is_traffic_verified?: boolean;
}

export function ProductMetrics({
  monthlyRevenue,
  monthly_traffic,
  gross_profit_margin,
  monthly_churn_rate,
  is_revenue_verified,
  is_code_audited,
  is_traffic_verified
}: ProductMetricsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {/* MRR */}
        {monthlyRevenue !== undefined && monthlyRevenue > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="text-gray-600">MRR: {formatCurrency(monthlyRevenue)}</span>
          </div>
        )}
        
        {/* Monthly visitors */}
        {monthly_traffic !== undefined && monthly_traffic > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-gray-600">
              {new Intl.NumberFormat('en-US').format(monthly_traffic)} monthly visitors
            </span>
          </div>
        )}
        
        {/* Profit Margin */}
        {gross_profit_margin !== undefined && (
          <div className="flex items-center gap-2 text-gray-700">
            <Star className="h-5 w-5 text-amber-500" />
            <span className="text-gray-600">
              {gross_profit_margin}% profit margin
            </span>
          </div>
        )}
        
        {/* Churn Rate */}
        {monthly_churn_rate !== undefined && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-5 w-5 text-purple-500" />
            <span className="text-gray-600">
              {monthly_churn_rate}% monthly churn
            </span>
          </div>
        )}
      </div>
      
      {/* Verification Badges */}
      <div className="flex flex-wrap gap-1.5">
        {is_revenue_verified && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            <Shield className="w-3 h-3 mr-1" /> Revenue Verified
          </Badge>
        )}
        {is_code_audited && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" /> Code Audited
          </Badge>
        )}
        {is_traffic_verified && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
            <Users className="w-3 h-3 mr-1" /> Traffic Verified
          </Badge>
        )}
      </div>
    </div>
  );
}
