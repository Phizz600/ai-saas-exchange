import { StatsCard } from "../StatsCard";
import { TrendingUp } from "lucide-react";

interface SuccessfulExitsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const SuccessfulExitsCard = ({ value, change }: SuccessfulExitsCardProps) => {
  // Generate realistic chart data for successful exits
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = Math.max(1, Math.floor(currentValue * 0.3));
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.8)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.6)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.4)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.2)) },
      { value: Math.max(0, currentValue - 1) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Successful Exits"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "completed sales"}
      icon={<TrendingUp className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(142, 76%, 36%)"
    />
  );
};