import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";

interface RevenueCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const RevenueCard = ({ value, change }: RevenueCardProps) => {
  return (
    <StatsCard
      title="Total Revenue"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : undefined}
    />
  );
};