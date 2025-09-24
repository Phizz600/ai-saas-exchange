import { StatsCard } from "../StatsCard";
import { Eye } from "lucide-react";

interface ViewsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ViewsCard = ({ value, change }: ViewsCardProps) => {
  // Sample chart data showing view trends
  const chartData = [
    { value: Math.floor(value * 0.7) },
    { value: Math.floor(value * 0.8) },
    { value: Math.floor(value * 0.6) },
    { value: Math.floor(value * 0.9) },
    { value: Math.floor(value * 0.85) },
    { value: Math.floor(value * 0.95) },
    { value: value }
  ];

  return (
    <StatsCard
      title="Total Views"
      value={value.toLocaleString()}
      change={change}
      subtitle={change ? "vs last month" : "product impressions"}
      icon={<Eye className="w-4 h-4 text-primary" />}
      chartData={chartData}
      chartColor="hsl(220, 70%, 50%)"
    />
  );
};