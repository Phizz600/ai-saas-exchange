
import { useSellerStats } from "@/hooks/useSellerStats";
import { RevenueCard } from "./stats/RevenueCard";
import { ProductsCard } from "./stats/ProductsCard";
import { ViewsCard } from "./stats/ViewsCard";
import { BidsCard } from "./stats/BidsCard";
import { SuccessfulExitsCard } from "./stats/SuccessfulExitsCard";
import { TransactionValueCard } from "./stats/TransactionValueCard";
import { AverageExitCard } from "./stats/AverageExitCard";
import { InterestedBuyersCard } from "./stats/InterestedBuyersCard";
import { useIsMobile } from "@/hooks/use-mobile";

export const MarketplaceStats = () => {
  const { data: stats } = useSellerStats();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <RevenueCard 
        value={stats?.totalExitValue || 0} 
        successfulExits={stats?.successfulExits || 0}
        change={stats?.exitValueChange} 
      />
      <SuccessfulExitsCard 
        value={stats?.successfulExits || 0}
        change={stats?.successfulExitsChange} 
      />
      <TransactionValueCard 
        value={stats?.totalTransactionValue || 0}
        change={stats?.conversionRateChange} 
      />
      <AverageExitCard 
        value={stats?.averageExitValue || 0}
        change={stats?.exitValueChange} 
      />
      <ProductsCard 
        value={stats?.productCount || 0} 
        activeCount={stats?.activeProductCount || 0}
        change={stats?.productCountChange} 
      />
      <ViewsCard value={stats?.views || 0} change={stats?.viewsChange} />
      <BidsCard value={stats?.totalOffers || 0} change={stats?.bidsChange} />
      <InterestedBuyersCard 
        value={stats?.interestedBuyers || 0}
        change={stats?.interestedBuyersChange} 
      />
    </div>
  );
};
