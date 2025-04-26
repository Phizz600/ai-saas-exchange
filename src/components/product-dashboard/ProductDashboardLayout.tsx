
import { Header } from "@/components/Header";
import { ProductDashboardContent } from "./ProductDashboardContent";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { MarketplaceStats } from "./MarketplaceStats";
import { QuickActions } from "./QuickActions";
import { useIsMobile } from "@/hooks/use-mobile";

export const ProductDashboardLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 md:py-8 mt-16">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-exo">Product Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Manage your AI product listings</p>
            </div>
            <Link to="/list-product" className="w-full md:w-auto">
              <Button className="w-full md:w-auto flex items-center gap-2 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity h-11 min-h-[44px]">
                <Plus className="h-4 w-4" />
                List New Product
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <MarketplaceStats />
          </div>
          
          <QuickActions />
          <ProductDashboardContent showVerifiedOnly={false} />
        </div>
      </main>
    </div>
  );
};
