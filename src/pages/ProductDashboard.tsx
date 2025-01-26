import { DashboardLayout } from "@/components/product-dashboard/DashboardLayout";
import { MarketplaceStats } from "@/components/product-dashboard/MarketplaceStats";
import { ProductDashboardContent } from "@/components/product-dashboard/ProductDashboardContent";

export const ProductDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <MarketplaceStats />
        <div>
          <h2 className="text-xl font-semibold mb-4 font-exo">Your Products</h2>
          <ProductDashboardContent />
        </div>
      </div>
    </DashboardLayout>
  );
};