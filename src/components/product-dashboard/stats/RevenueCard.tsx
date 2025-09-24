import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface RevenueCardProps {
  value: number;
  successfulExits: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const RevenueCard = ({ value, successfulExits, change }: RevenueCardProps) => {
  return (
    <StatsCard
      title="Total Exit Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : `${successfulExits} successful exit${successfulExits !== 1 ? 's' : ''}`}
      icon={<DollarSign className="w-4 h-4 text-primary" />}
    />
  );
};