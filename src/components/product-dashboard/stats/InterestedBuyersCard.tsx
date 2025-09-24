import { StatsCard } from "../StatsCard";
import { Heart } from "lucide-react";

interface InterestedBuyersCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const InterestedBuyersCard = ({ value, change }: InterestedBuyersCardProps) => {
  // Generate realistic chart data for interested buyers
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = Math.max(1, Math.floor(currentValue * 0.3));
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.7)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.4)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.8)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.2)) },
      { value: Math.max(0, currentValue - Math.floor(variation * 0.5)) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Interested Buyers"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "buyers watching"}
      icon={<Heart className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(350, 70%, 55%)"
    />
  );
};