import { StatsCard } from "../../product-dashboard/StatsCard";
import { Target } from "lucide-react";

interface OfferSuccessRateCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const OfferSuccessRateCard = ({ value, change }: OfferSuccessRateCardProps) => {
  return (
    <StatsCard
      title="Deal Success Rate"
      value={`${Math.round(value)}%`}
      change={change}
      subtitle={change ? "vs last month" : "acceptance rate"}
      icon={<Target className="w-4 h-4 text-primary" />}
    />
  );
};