import { StatsCard } from "../../product-dashboard/StatsCard";
import { Target } from "lucide-react";

interface OfferSuccessRateCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const OfferSuccessRateCard = ({ value, change }: OfferSuccessRateCardProps) => {
  // Generate realistic chart data for success rate (percentage)
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const maxRate = 100;
    const variation = Math.min(20, currentValue * 0.3);
    return [
      { value: Math.max(0, Math.min(maxRate, currentValue - variation)) },
      { value: Math.max(0, Math.min(maxRate, currentValue - variation * 0.7)) },
      { value: Math.max(0, Math.min(maxRate, currentValue - variation * 0.4)) },
      { value: Math.max(0, Math.min(maxRate, currentValue - variation * 0.8)) },
      { value: Math.max(0, Math.min(maxRate, currentValue - variation * 0.2)) },
      { value: Math.max(0, Math.min(maxRate, currentValue - variation * 0.1)) },
      { value: Math.max(0, Math.min(maxRate, currentValue)) }
    ];
  };

  return (
    <StatsCard
      title="Deal Success Rate"
      value={`${Math.round(value)}%`}
      change={change}
      subtitle={change ? "vs last month" : "acceptance rate"}
      icon={<Target className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(47, 96%, 53%)"
    />
  );
};