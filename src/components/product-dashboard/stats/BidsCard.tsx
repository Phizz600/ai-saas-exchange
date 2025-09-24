import { StatsCard } from "../StatsCard";
import { MessageSquare } from "lucide-react";

interface BidsCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const BidsCard = ({ value, change }: BidsCardProps) => {
  // Generate realistic chart data showing bid trends
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const maxVariation = Math.max(1, Math.floor(currentValue * 0.4));
    return [
      { value: Math.max(0, currentValue - maxVariation) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.6)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.8)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.3)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.7)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.1)) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Total Offers"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "from buyers"}
      icon={<MessageSquare className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(142, 76%, 36%)"
    />
  );
};