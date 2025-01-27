import { StatsCard } from "../StatsCard";

interface ViewsCardProps {
  value: number;
}

export const ViewsCard = ({ value }: ViewsCardProps) => {
  return (
    <StatsCard
      title="Total Views"
      value={value}
      change={{ value: 12, type: 'increase' }}
      subtitle="vs last month"
    />
  );
};