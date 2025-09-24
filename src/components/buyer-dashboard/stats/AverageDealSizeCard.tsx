import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface AverageDealSizeCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const AverageDealSizeCard = ({ value, change }: AverageDealSizeCardProps) => {
  return (
    <StatsCard
      title="Average Deal Size"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "per transaction"}
      icon={<TrendingUp className="w-4 h-4 text-primary" />}
    />
  );
};