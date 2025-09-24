import { StatsCard } from "../../product-dashboard/StatsCard";
import { Search } from "lucide-react";

interface CompaniesUnderReviewCardProps {
  value: number;
  change?: { value: number; type: 'increase' | 'decrease' };
}

export const CompaniesUnderReviewCard = ({ value, change }: CompaniesUnderReviewCardProps) => {
  return (
    <StatsCard
      title="Due Diligence Pipeline"
      value={value}
      change={change}
      subtitle={change ? "vs last month" : "companies under review"}
      icon={<Search className="w-4 h-4 text-primary" />}
    />
  );
};