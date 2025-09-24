import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface TotalOffersValueCardProps {
  value: number;
  totalOffers: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const TotalOffersValueCard = ({ value, totalOffers, change }: TotalOffersValueCardProps) => {
  return (
    <StatsCard
      title="Total Deal Flow"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : `${totalOffers} offer${totalOffers !== 1 ? 's' : ''} made`}
      icon={<DollarSign className="w-4 h-4 text-primary" />}
    />
  );
};