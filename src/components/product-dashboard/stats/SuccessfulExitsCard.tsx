import { StatsCard } from "../StatsCard";
import { TrendingUp } from "lucide-react";

interface SuccessfulExitsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const SuccessfulExitsCard = ({ value, change }: SuccessfulExitsCardProps) => {
  return (
    <StatsCard
      title="Successful Exits"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "completed sales"}
      icon={<TrendingUp className="w-4 h-4 text-primary" />}
    />
  );
};