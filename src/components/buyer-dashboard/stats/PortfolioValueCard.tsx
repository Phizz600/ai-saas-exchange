import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { PieChart } from "lucide-react";

interface PortfolioValueCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const PortfolioValueCard = ({ value, change }: PortfolioValueCardProps) => {
  // Generate realistic chart data showing portfolio growth
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const variation = currentValue * 0.25;
    return [
      { value: Math.max(0, currentValue - variation) },
      { value: Math.max(0, currentValue - variation * 0.8) },
      { value: Math.max(0, currentValue - variation * 0.5) },
      { value: Math.max(0, currentValue - variation * 0.7) },
      { value: Math.max(0, currentValue - variation * 0.2) },
      { value: Math.max(0, currentValue - variation * 0.1) },
      { value: currentValue }
    ];
  };

  return (
    <StatsCard
      title="Portfolio Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "completed acquisitions"}
      icon={<PieChart className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(271, 91%, 65%)"
    />
  );
};