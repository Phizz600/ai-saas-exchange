import { StatsCard } from "../StatsCard";
import { TrendingUp } from "lucide-react";

interface ConversionRateCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ConversionRateCard = ({ value, change }: ConversionRateCardProps) => {
  return (
    <StatsCard
      title="Conversion Rate"
      value={`${value.toFixed(1)}%`}
      change={change}
      subtitle={change ? "vs last month" : "offers/views"}
      icon={<TrendingUp className="w-4 h-4 text-primary" />}
    />
  );
};