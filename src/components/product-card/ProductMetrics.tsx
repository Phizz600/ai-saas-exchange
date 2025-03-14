
import { Zap, DollarSign, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductMetricsProps {
  growthRate: string;
  monthlyRevenue: number;
}

export function ProductMetrics({ growthRate, monthlyRevenue }: ProductMetricsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-700">
        <Zap className="w-4 h-4 text-amber-500" />
        <span>{growthRate} MoM Growth</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-700">
        <DollarSign className="w-4 h-4 text-green-500" />
        <span>{formatCurrency(monthlyRevenue)} MRR</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-700">
        <ShieldCheck className="w-4 h-4 text-blue-500" />
        <span>Revenue Verified</span>
      </div>
    </div>
  );
}
