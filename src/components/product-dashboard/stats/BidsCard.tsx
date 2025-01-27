import { StatsCard } from "../StatsCard";

interface BidsCardProps {
  value: number;
}

export const BidsCard = ({ value }: BidsCardProps) => {
  return (
    <StatsCard
      title="Total Bids"
      value={value}
      change={{ value: 15, type: 'increase' }}
      subtitle="vs last month"
    />
  );
};