import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface AverageDealSizeCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const AverageDealSizeCard = ({ value, change }: AverageDealSizeCardProps) => {
  // Generate realistic chart data for average deal size
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = currentValue * 0.25;
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - variation * 0.6) },
      { value: Math.max(0, currentValue - variation * 0.9) },
      { value: Math.max(0, currentValue - variation * 0.3) },
      { value: Math.max(0, currentValue - variation * 0.7) },
      { value: Math.max(0, currentValue - variation * 0.1) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Average Deal Size"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "per transaction"}
      icon={<TrendingUp className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(271, 91%, 65%)"
    />
  );
};