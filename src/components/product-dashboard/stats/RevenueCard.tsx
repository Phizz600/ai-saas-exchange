import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";

interface RevenueCardProps {
  value: number;
}

export const RevenueCard = ({ value }: RevenueCardProps) => {
  return (
    <StatsCard
      title="Total Revenue"
      value={formatCurrency(value)}
      change={{ value: 4, type: 'increase' }}
      subtitle="vs last month"
    />
  );
};