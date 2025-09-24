import { DashboardLayout } from "@/components/product-dashboard/DashboardLayout";
import { MarketplaceStats } from "@/components/product-dashboard/MarketplaceStats";
import { ProductDashboardContent } from "@/components/product-dashboard/ProductDashboardContent";
import { BuyerStats } from "@/components/buyer-dashboard/BuyerStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag, ToggleLeft, ToggleRight, Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/product-dashboard/StatsCard";
import { ActiveBidsProducts } from "@/components/product-dashboard/ActiveBidsProducts";
import { WatchedProducts } from "@/components/product-dashboard/WatchedProducts";
import { ProductOffers } from "@/components/product-dashboard/ProductOffers";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuctionAnalytics } from "@/components/product-dashboard/AuctionAnalytics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EditListingForm } from "@/components/product-dashboard/EditListingForm";
import { DealTrackerPipeline } from "@/components/deal-tracker/DealTrackerPipeline";

function ProductDashboard() {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

  // Fetch user's auction products
  const {
    data: auctionProducts
  } = useQuery({
    queryKey: ['user-auction-products'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return [];
      const {
        data,
        error
      } = await supabase.from('products').select('id, title, auction_end_time').eq('seller_id', user.id).not('auction_end_time', 'is', null).order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching auction products:', error);
        return [];
      }
      return data;
    }
  });
  return <DashboardLayout>
      <Tabs defaultValue="seller" className="space-y-8">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
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
          
          <div className="w-full md:w-auto mt-2 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 w-full md:w-[250px] bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/60" />
            </div>
          </div>
        </div>
        
        <TabsContent value="seller" className="space-y-8">
          <MarketplaceStats />
          
          <DealTrackerPipeline userRole="seller" />
          
          {auctionProducts && auctionProducts.length > 0 && <div>
              <h2 className="text-xl font-semibold mb-4 exo-2-header">Auction Analytics</h2>
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <label htmlFor="auction-select" className="text-sm font-medium">
                    Select auction to view:
                  </label>
                  <select id="auction-select" value={selectedProductId || ''} onChange={e => setSelectedProductId(e.target.value || undefined)} className="border rounded p-2 bg-background">
                    <option value="">Select an auction</option>
                    {auctionProducts.map(product => <option key={product.id} value={product.id}>
                        {product.title}
                      </option>)}
                  </select>
                </div>
              </div>
              <AuctionAnalytics productId={selectedProductId} />
            </div>}
          
          <div>
            <h2 className="text-xl font-semibold mb-4 exo-2-header text-neutral-50">Offers on Your Listings</h2>
            <ProductOffers />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 exo-2-header text-neutral-50">Edit Your Listings</h2>
            <EditListingForm />
          </div>
          
        </TabsContent>

        <TabsContent value="buyer" className="space-y-8">
          <BuyerStats />
          
          <DealTrackerPipeline userRole="buyer" />
          
          <div className="space-y-8">
            <div className="text-neutral-50">
              <h2 className="text-xl font-semibold mb-4 exo-2-header">Your Active Bids</h2>
              <ActiveBidsProducts />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 exo-2-header text-neutral-50">Saved Listings</h2>
              <WatchedProducts />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>;
}
export default ProductDashboard;
export { ProductDashboard };