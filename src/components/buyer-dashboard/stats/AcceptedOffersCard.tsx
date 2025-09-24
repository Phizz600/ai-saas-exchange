import { StatsCard } from "../../product-dashboard/StatsCard";
import { CheckCircle } from "lucide-react";

interface AcceptedOffersCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const AcceptedOffersCard = ({ value, change }: AcceptedOffersCardProps) => {
  return (
    <StatsCard
      title="Successful Deals"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "accepted offers"}
      icon={<CheckCircle className="w-4 h-4 text-primary" />}
    />
  );
};