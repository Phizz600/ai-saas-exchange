import { StatsCard } from "../../product-dashboard/StatsCard";
import { CheckCircle } from "lucide-react";

interface AcceptedOffersCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const AcceptedOffersCard = ({ value, change }: AcceptedOffersCardProps) => {
  // Generate realistic chart data for accepted offers
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const maxVariation = Math.max(1, Math.floor(currentValue * 0.4));
    return [
      { value: Math.max(0, currentValue - maxVariation) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.7)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.5)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.8)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.3)) },
      { value: Math.max(0, currentValue - Math.floor(maxVariation * 0.1)) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Successful Deals"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "accepted offers"}
      icon={<CheckCircle className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(142, 76%, 36%)"
    />
  );
};