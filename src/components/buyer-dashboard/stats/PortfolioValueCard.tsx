import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { PieChart } from "lucide-react";

interface PortfolioValueCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const PortfolioValueCard = ({ value, change }: PortfolioValueCardProps) => {
  // Sample chart data showing portfolio growth
  const portfolioTrendData = [
    { value: Math.floor(value * 0.6) },
    { value: Math.floor(value * 0.7) },
    { value: Math.floor(value * 0.75) },
    { value: Math.floor(value * 0.8) },
    { value: Math.floor(value * 0.9) },
    { value: Math.floor(value * 0.95) },
    { value: value }
  ];

  return (
    <StatsCard
      title="Portfolio Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "completed acquisitions"}
      icon={<PieChart className="w-4 h-4 text-primary" />}
      chartData={portfolioTrendData}
      chartColor="hsl(271, 91%, 65%)"
    />
  );
};