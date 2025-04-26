
import { useSellerStats } from "@/hooks/useSellerStats";
import { RevenueCard } from "./stats/RevenueCard";
import { ProductsCard } from "./stats/ProductsCard";
import { ViewsCard } from "./stats/ViewsCard";
import { BidsCard } from "./stats/BidsCard";
import { useIsMobile } from "@/hooks/use-mobile";

export const MarketplaceStats = () => {
  const { data: stats } = useSellerStats();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {/* Full width on smaller screens for revenue and products */}
      <div className="col-span-2 md:col-span-1">
        <RevenueCard value={stats?.totalRevenue || 0} />
      </div>
      <div className="col-span-2 md:col-span-1">
        <ProductsCard value={stats?.productCount || 0} />
      </div>
      {/* Half width for views and bids */}
      <div className="col-span-1">
        <ViewsCard value={stats?.views || 0} />
      </div>
      <div className="col-span-1">
        <BidsCard value={stats?.totalBids || 0} />
      </div>
    </div>
  );
};
