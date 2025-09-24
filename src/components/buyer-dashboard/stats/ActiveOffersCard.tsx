import { Clock } from "lucide-react";
import { StatsCard } from "../../product-dashboard/StatsCard";

interface ActiveOffersCardProps {
  value: number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

export const ActiveOffersCard = ({ value, change }: ActiveOffersCardProps) => {
  return (
    <StatsCard
      title="Active Offers"
      value={value.toString()}
      icon={<Clock className="w-4 h-4 text-amber-400" />}
      change={change}
    />
  );
};