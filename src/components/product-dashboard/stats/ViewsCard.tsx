import { StatsCard } from "../StatsCard";

interface ViewsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ViewsCard = ({ value, change }: ViewsCardProps) => {
  return (
    <StatsCard
      title="Total Views"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : undefined}
    />
  );
};