import { StatsCard } from "../StatsCard";
import { Package } from "lucide-react";

interface ProductsCardProps {
  value: number;
  activeCount: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const ProductsCard = ({ value, activeCount, change }: ProductsCardProps) => {
  // Generate realistic chart data based on actual values
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const baseValue = Math.max(1, currentValue - 6);
    return [
      { value: baseValue },
      { value: baseValue + 1 },
      { value: baseValue + 2 },
      { value: baseValue + 1 },
      { value: baseValue + 3 },
      { value: baseValue + 2 },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Total Listings"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : `${activeCount} active`}
      icon={<Package className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(var(--primary))"
    />
  );
};