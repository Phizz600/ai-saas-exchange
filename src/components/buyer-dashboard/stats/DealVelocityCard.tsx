import { StatsCard } from "../../product-dashboard/StatsCard";
import { Zap } from "lucide-react";

interface DealVelocityCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const DealVelocityCard = ({ value, change }: DealVelocityCardProps) => {
  // Generate realistic chart data showing deal velocity over time
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const maxVariation = Math.max(1, Math.floor(currentValue * 0.5));
    return [
      { value: Math.max(0, currentValue - maxVariation) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.7)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.3)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.9)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.2)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.1)) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Deal Velocity"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "offers this month"}
      icon={<Zap className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(47, 96%, 53%)"
    />
  );
};