import { StatsCard } from "../StatsCard";

interface BidsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const BidsCard = ({ value, change }: BidsCardProps) => {
  return (
    <StatsCard
      title="Total Bids"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : undefined}
    />
  );
};