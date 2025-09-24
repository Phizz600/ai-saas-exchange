import { StatsCard } from "../StatsCard";
import { formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface AverageExitCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const AverageExitCard = ({ value, change }: AverageExitCardProps) => {
  return (
    <StatsCard
      title="Average Exit Value"
      value={formatCurrency(value)}
      change={change}
      subtitle={change ? "vs last month" : "per transaction"}
      icon={<BarChart3 className="w-4 h-4 text-primary" />}
    />
  );
};