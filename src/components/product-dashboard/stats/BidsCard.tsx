import { StatsCard } from "../StatsCard";
import { MessageSquare } from "lucide-react";

interface BidsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const BidsCard = ({ value, change }: BidsCardProps) => {
  // Sample chart data showing bid trends
  const chartData = [
    { value: Math.max(0, value - 15) },
    { value: Math.max(0, value - 8) },
    { value: Math.max(0, value - 12) },
    { value: Math.max(0, value - 5) },
    { value: Math.max(0, value - 3) },
    { value: Math.max(0, value - 1) },
    { value: value }
  ];

  return (
    <StatsCard
      title="Total Offers"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "from buyers"}
      icon={<MessageSquare className="w-4 h-4 text-primary" />}
      chartData={chartData}
      chartColor="hsl(142, 76%, 36%)"
    />
  );
};