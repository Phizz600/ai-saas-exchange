import { useBuyerStats } from "@/hooks/useBuyerStats";
import { TotalOffersValueCard } from "./stats/TotalOffersValueCard";
import { AcceptedOffersCard } from "./stats/AcceptedOffersCard";
import { PortfolioValueCard } from "./stats/PortfolioValueCard";
import { OfferSuccessRateCard } from "./stats/OfferSuccessRateCard";
import { AverageDealSizeCard } from "./stats/AverageDealSizeCard";
import { CompaniesUnderReviewCard } from "./stats/CompaniesUnderReviewCard";
import { DealVelocityCard } from "./stats/DealVelocityCard";
import { ActiveOffersCard } from "./stats/ActiveOffersCard";
import { useIsMobile } from "@/hooks/use-mobile";

export const BuyerStats = () => {
  const { data: stats } = useBuyerStats();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <TotalOffersValueCard 
        value={stats?.totalOffersValue || 0} 
        totalOffers={stats?.totalOffersMade || 0}
        change={stats?.totalOffersValueChange} 
      />
      <AcceptedOffersCard 
        value={stats?.acceptedOffers || 0}
        change={stats?.acceptedOffersChange} 
      />
      <PortfolioValueCard 
        value={stats?.portfolioValue || 0}
        change={stats?.portfolioValueChange} 
      />
      <OfferSuccessRateCard 
        value={stats?.offerSuccessRate || 0}
        change={stats?.offerSuccessRateChange} 
      />
      <AverageDealSizeCard 
        value={stats?.averageDealSize || 0}
        change={stats?.totalOffersValueChange} 
      />
      <CompaniesUnderReviewCard 
        value={stats?.companiesUnderReview || 0}
        change={stats?.acceptedOffersChange} 
      />
      <DealVelocityCard 
        value={stats?.dealVelocity || 0}
        change={stats?.dealVelocityChange} 
      />
      <ActiveOffersCard 
        value={stats?.activeOffers || 0}
        change={stats?.acceptedOffersChange} 
      />
    </div>
  );
};