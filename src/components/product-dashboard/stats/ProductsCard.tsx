import { StatsCard } from "../StatsCard";

interface ProductsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ProductsCard = ({ value, change }: ProductsCardProps) => {
  return (
    <StatsCard
      title="Total Products"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : undefined}
    />
  );
};