import { StatsCard } from "../../product-dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { PieChart } from "lucide-react";

interface PortfolioValueCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const PortfolioValueCard = ({ value, change }: PortfolioValueCardProps) => {
  return (
    <StatsCard
      title="Portfolio Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "completed acquisitions"}
      icon={<PieChart className="w-4 h-4 text-primary" />}
    />
  );
};