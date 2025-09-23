import { StatsCard } from "../StatsCard";
import { MessageSquare } from "lucide-react";

interface BidsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const BidsCard = ({ value, change }: BidsCardProps) => {
  return (
    <StatsCard
      title="Total Offers"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "from buyers"}
      icon={<MessageSquare className="w-4 h-4 text-primary" />}
    />
  );
};