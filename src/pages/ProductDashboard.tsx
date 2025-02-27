import { DashboardLayout } from "@/components/product-dashboard/DashboardLayout";
import { MarketplaceStats } from "@/components/product-dashboard/MarketplaceStats";
import { ProductDashboardContent } from "@/components/product-dashboard/ProductDashboardContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag, ToggleLeft, ToggleRight } from "lucide-react";
import { StatsCard } from "@/components/product-dashboard/StatsCard";
import { ActiveBidsProducts } from "@/components/product-dashboard/ActiveBidsProducts";
import { WatchedProducts } from "@/components/product-dashboard/WatchedProducts";
import { MatchedProducts } from "@/components/product-dashboard/MatchedProducts";
import { ProductOffers } from "@/components/product-dashboard/ProductOffers";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export const ProductDashboard = () => {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  return <DashboardLayout>
      <Tabs defaultValue="seller" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="seller" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Seller Dashboard
          </TabsTrigger>
          <TabsTrigger value="buyer" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Buyer Dashboard
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="seller" className="space-y-8">
          <div className="flex justify-between items-center">
            <MarketplaceStats />
            
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 font-exo">Offers on Your Products</h2>
            <ProductOffers />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 font-exo">Your Products</h2>
            <ProductDashboardContent showVerifiedOnly={showVerifiedOnly} />
          </div>
        </TabsContent>

        <TabsContent value="buyer" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Active Bids" value="0" change={{
            value: 0,
            type: 'increase'
          }} subtitle="vs last month" />
            <StatsCard title="Won Auctions" value="0" change={{
            value: 0,
            type: 'increase'
          }} subtitle="vs last month" />
            <StatsCard title="Total Spent" value="$0" change={{
            value: 0,
            type: 'increase'
          }} subtitle="vs last month" />
            <StatsCard title="Watched Products" value="0" change={{
            value: 0,
            type: 'increase'
          }} subtitle="vs last month" />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 font-exo">Your Matches</h2>
              <MatchedProducts />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 font-exo">Your Active Bids</h2>
              <ActiveBidsProducts />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 font-exo">Products You've Saved</h2>
              <WatchedProducts />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>;
};