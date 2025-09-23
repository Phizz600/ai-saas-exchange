import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface RevenueCardProps {
  value: number;
  averagePerProduct: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const RevenueCard = ({ value, averagePerProduct, change }: RevenueCardProps) => {
  return (
    <StatsCard
      title="Total Revenue"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : `${formatCurrency(averagePerProduct)} avg per product`}
      icon={<DollarSign className="w-4 h-4 text-primary" />}
    />
  );
};