import { DashboardLayout } from "@/components/product-dashboard/DashboardLayout";
import { MarketplaceStats } from "@/components/product-dashboard/MarketplaceStats";
import { QuickActions } from "@/components/product-dashboard/QuickActions";
import { ProductsTable } from "@/components/product-dashboard/ProductsTable";

export const ProductDashboard = () => {
  return (
    <DashboardLayout>
      <MarketplaceStats />
      <QuickActions />
      <ProductsTable products={[]} />
    </DashboardLayout>
  );
};