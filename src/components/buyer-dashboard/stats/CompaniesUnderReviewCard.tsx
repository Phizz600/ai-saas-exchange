import { StatsCard } from "../../product-dashboard/StatsCard";
import { Search } from "lucide-react";

interface CompaniesUnderReviewCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const CompaniesUnderReviewCard = ({ value, change }: CompaniesUnderReviewCardProps) => {
  // Generate realistic chart data for companies under review
  const generateChartData = (currentValue: number) => {
    if (currentValue === 0) {
      return Array(7).fill({ value: 0 });
    }
    
    const maxVariation = Math.max(1, Math.floor(currentValue * 0.5));
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
      title="Due Diligence Pipeline"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "companies under review"}
      icon={<Search className="w-4 h-4 text-primary" />}
      chartData={generateChartData(value)}
      chartColor="hsl(220, 70%, 50%)"
    />
  );
};