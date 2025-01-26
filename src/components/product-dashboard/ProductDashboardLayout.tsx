import { Header } from "@/components/Header";
import { ProductDashboardContent } from "./ProductDashboardContent";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { MarketplaceStats } from "./MarketplaceStats";
import { QuickActions } from "./QuickActions";

export const ProductDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-exo">Product Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your AI product listings</p>
            </div>
            <Link to="/list-product">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" />
                List New Product
              </Button>
            </Link>
          </div>
          <MarketplaceStats />
          <QuickActions />
          <ProductDashboardContent />
        </div>
      </main>
    </div>
  );
};