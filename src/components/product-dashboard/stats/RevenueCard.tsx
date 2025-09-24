import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface RevenueCardProps {
  value: number;
  successfulExits: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const RevenueCard = ({ value, successfulExits, change }: RevenueCardProps) => {
  // Sample chart data - replace with real data in production
  const chartData = [
    { value: 45000 },
    { value: 52000 },
    { value: 48000 },
    { value: 61000 },
    { value: 55000 },
    { value: 67000 },
    { value: value }
  ];

  return (
    <StatsCard
      title="Total Exit Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : `${successfulExits} successful exit${successfulExits !== 1 ? 's' : ''}`}
      icon={<DollarSign className="w-4 h-4 text-primary" />}
      chartData={chartData}
      chartColor="hsl(var(--primary))"
    />
  );
};