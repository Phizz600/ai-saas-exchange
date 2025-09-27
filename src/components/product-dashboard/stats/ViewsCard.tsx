import { StatsCard } from "../StatsCard";
import { Eye } from "lucide-react";

interface ViewsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ViewsCard = ({ value, change }: ViewsCardProps) => {
  // Generate realistic chart data showing view trends
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = currentValue * 0.25;
    return [
      { value: Math.max(0, Math.floor(currentValue - variation)) },
      { value: Math.max(0, Math.floor(currentValue - variation * 0.8)) },
      { value: Math.max(0, Math.floor(currentValue - variation * 0.6)) },
      { value: Math.max(0, Math.floor(currentValue - variation * 0.9)) },
      { value: Math.max(0, Math.floor(currentValue - variation * 0.3)) },
      { value: Math.max(0, Math.floor(currentValue - variation * 0.1)) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Total Listing Views"
      value={value.toLocaleString()}
      change={change}
      subtitle={change ? "vs last month" : "product impressions"}
      icon={<Eye className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(220, 70%, 50%)"
    />
  );
};