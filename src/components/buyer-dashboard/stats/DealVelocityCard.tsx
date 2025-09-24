import { StatsCard } from "../../product-dashboard/StatsCard";
import { Zap } from "lucide-react";

interface DealVelocityCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const DealVelocityCard = ({ value, change }: DealVelocityCardProps) => {
  // Sample chart data showing deal velocity over time
  const velocityData = [
    { value: Math.max(0, value - 8) },
    { value: Math.max(0, value - 12) },
    { value: Math.max(0, value - 4) },
    { value: Math.max(0, value - 6) },
    { value: Math.max(0, value - 2) },
    { value: Math.max(0, value - 1) },
    { value: value }
  ];

  return (
    <StatsCard
      title="Deal Velocity"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "offers this month"}
      icon={<Zap className="w-4 h-4 text-primary" />}
      chartData={velocityData}
      chartColor="hsl(47, 96%, 53%)"
    />
  );
};