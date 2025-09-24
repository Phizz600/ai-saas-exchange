import { StatsCard } from "../StatsCard";
import { Package } from "lucide-react";

interface ProductsCardProps {
  value: number;
  activeCount: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ProductsCard = ({ value, activeCount, change }: ProductsCardProps) => {
  return (
    <StatsCard
      title="Total Listings"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : `${activeCount} active`}
      icon={<Package className="w-4 h-4 text-primary" />}
    />
  );
};