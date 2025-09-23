import { StatsCard } from "../StatsCard";
import { Eye } from "lucide-react";

interface ViewsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ViewsCard = ({ value, change }: ViewsCardProps) => {
  return (
    <StatsCard
      title="Total Views"
      value={value.toLocaleString()}
      change={change}
      subtitle={change ? "vs last month" : "product impressions"}
      icon={<Eye className="w-4 h-4 text-primary" />}
    />
  );
};