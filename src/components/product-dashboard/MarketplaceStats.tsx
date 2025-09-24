
import { useSellerStats } from "@/hooks/useSellerStats";
import { RevenueCard } from "./stats/RevenueCard";
import { ProductsCard } from "./stats/ProductsCard";
import { ViewsCard } from "./stats/ViewsCard";
import { BidsCard } from "./stats/BidsCard";
import { SuccessfulExitsCard } from "./stats/SuccessfulExitsCard";
import { TransactionValueCard } from "./stats/TransactionValueCard";
import { AverageExitCard } from "./stats/AverageExitCard";
import { useIsMobile } from "@/hooks/use-mobile";

export const MarketplaceStats = () => {
  const { data: stats } = useSellerStats();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {/* First row - Key M&A metrics */}
      <div className="col-span-2 lg:col-span-1">
        <RevenueCard 
          value={stats?.totalExitValue || 0} 
          successfulExits={stats?.successfulExits || 0}
          change={stats?.exitValueChange} 
        />
      </div>
      <div className="col-span-1">
        <SuccessfulExitsCard 
          value={stats?.successfulExits || 0}
          change={stats?.successfulExitsChange} 
        />
      </div>
      <div className="col-span-1">
        <TransactionValueCard 
          value={stats?.totalTransactionValue || 0}
          change={stats?.conversionRateChange} 
        />
      </div>
      
      {/* Second row - Supporting metrics */}
      <div className="col-span-1">
        <AverageExitCard 
          value={stats?.averageExitValue || 0}
          change={stats?.exitValueChange} 
        />
      </div>
      <div className="col-span-1">
        <ProductsCard 
          value={stats?.productCount || 0} 
          activeCount={stats?.activeProductCount || 0}
          change={stats?.productCountChange} 
        />
      </div>
      <div className="col-span-1">
        <ViewsCard value={stats?.views || 0} change={stats?.viewsChange} />
      </div>
      <div className="col-span-1">
        <BidsCard value={stats?.totalOffers || 0} change={stats?.bidsChange} />
      </div>
    </div>
  );
};
