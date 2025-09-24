import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface RevenueCardProps {
  value: number;
  successfulExits: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const RevenueCard = ({ value, successfulExits, change }: RevenueCardProps) => {
  // Generate realistic chart data based on actual revenue values
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = currentValue * 0.3;
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - variation * 0.8) },
      { value: Math.max(0, currentValue - variation * 0.5) },
      { value: Math.max(0, currentValue - variation * 0.9) },
      { value: Math.max(0, currentValue - variation * 0.2) },
      { value: Math.max(0, currentValue - variation * 0.4) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Total Exit Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : `${successfulExits} successful exit${successfulExits !== 1 ? 's' : ''}`}
      icon={<DollarSign className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(var(--primary))"
    />
  );
};