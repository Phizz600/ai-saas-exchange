import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface AverageExitCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const AverageExitCard = ({ value, change }: AverageExitCardProps) => {
  // Generate realistic chart data for average exit values
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = currentValue * 0.2;
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - variation * 0.7) },
      { value: Math.max(0, currentValue - variation * 0.9) },
      { value: Math.max(0, currentValue - variation * 0.4) },
      { value: Math.max(0, currentValue - variation * 0.1) },
      { value: Math.max(0, currentValue - variation * 0.3) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Average Exit Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "per transaction"}
      icon={<BarChart3 className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(220, 70%, 50%)"
    />
  );
};