import { useSellerStats } from "@/hooks/useSellerStats";
import { RevenueCard } from "./stats/RevenueCard";
import { ProductsCard } from "./stats/ProductsCard";
import { ViewsCard } from "./stats/ViewsCard";
import { BidsCard } from "./stats/BidsCard";

export const MarketplaceStats = () => {
  const { data: stats } = useSellerStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <RevenueCard value={stats?.totalRevenue || 0} />
      <ProductsCard value={stats?.productCount || 0} />
      <ViewsCard value={stats?.views || 0} />
      <BidsCard value={stats?.totalBids || 0} />
    </div>
  );
};