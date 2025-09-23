
import { useSellerStats } from "@/hooks/useSellerStats";
import { RevenueCard } from "./stats/RevenueCard";
import { ProductsCard } from "./stats/ProductsCard";
import { ViewsCard } from "./stats/ViewsCard";
import { BidsCard } from "./stats/BidsCard";
import { ConversionRateCard } from "./stats/ConversionRateCard";
import { useIsMobile } from "@/hooks/use-mobile";

export const MarketplaceStats = () => {
  const { data: stats } = useSellerStats();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
      {/* Revenue spans 2 columns on larger screens */}
      <div className="col-span-2 lg:col-span-1">
        <RevenueCard 
          value={stats?.totalRevenue || 0} 
          averagePerProduct={stats?.averageRevenuePerProduct || 0}
          change={stats?.revenueChange} 
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
      <div className="col-span-1">
        <ConversionRateCard value={stats?.conversionRate || 0} change={stats?.conversionRateChange} />
      </div>
    </div>
  );
};
