import { StatsCard } from "../StatsCard";

interface ProductsCardProps {
  value: number;
}

export const ProductsCard = ({ value }: ProductsCardProps) => {
  return (
    <StatsCard
      title="Total Products"
      value={value}
      change={{ value: 2, type: 'increase' }}
      subtitle="vs last month"
    />
  );
};