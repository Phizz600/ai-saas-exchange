import { Clock } from "lucide-react";
import { StatsCard } from "../../product-dashboard/StatsCard";

interface ActiveOffersCardProps {
  value: number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

export const ActiveOffersCard = ({ value, change }: ActiveOffersCardProps) => {
  // Generate realistic chart data for active offers
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
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.2)) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Active Offers"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "pending offers"}
      icon={<Clock className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(39, 84%, 56%)"
    />
  );
};