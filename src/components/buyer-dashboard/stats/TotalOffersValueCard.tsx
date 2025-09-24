import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface TotalOffersValueCardProps {
  value: number;
  totalOffers: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const TotalOffersValueCard = ({ value, totalOffers, change }: TotalOffersValueCardProps) => {
  // Generate realistic chart data for total offers value
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = currentValue * 0.3;
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - variation * 0.8) },
      { value: Math.max(0, currentValue - variation * 0.5) },
      { value: Math.max(0, currentValue - variation * 0.9) },
      { value: Math.max(0, currentValue - variation * 0.2) },
      { value: Math.max(0, currentValue - variation * 0.4) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Total Deal Flow"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : `${totalOffers} offer${totalOffers !== 1 ? 's' : ''} made`}
      icon={<DollarSign className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(142, 76%, 36%)"
    />
  );
};