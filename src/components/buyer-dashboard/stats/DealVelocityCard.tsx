import { StatsCard } from "../../product-dashboard/StatsCard";
import { Zap } from "lucide-react";

interface DealVelocityCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const DealVelocityCard = ({ value, change }: DealVelocityCardProps) => {
  return (
    <StatsCard
      title="Deal Velocity"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "offers this month"}
      icon={<Zap className="w-4 h-4 text-primary" />}
    />
  );
};