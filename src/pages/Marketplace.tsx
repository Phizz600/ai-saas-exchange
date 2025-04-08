
import { useState } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Footer } from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { motion } from "framer-motion";
import { Timer, TrendingDown } from "lucide-react";

export const Marketplace = () => {
  console.log('Marketplace page component rendered');
  const [activeTab, setActiveTab] = useState("all");
  const { products, isLoading } = useMarketplaceProducts();
  
  // Filter products by auction vs non-auction
  const auctionProducts = products?.filter(product => !!product.auction_end_time) || [];
  const regularProducts = products?.filter(product => !product.auction_end_time) || [];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <MarketplaceLayout>
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 exo-2-heading">
                Browse Marketplace
              </h2>
              <TabsList className="bg-white border shadow-sm">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D946EE] data-[state=active]:to-[#8B5CF6] data-[state=active]:text-white">
                  All Products
                </TabsTrigger>
                <TabsTrigger value="auctions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D946EE] data-[state=active]:to-[#8B5CF6] data-[state=active]:text-white">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4" />
                    <span>Auctions</span>
                    {auctionProducts.length > 0 && (
                      <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {auctionProducts.length}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="buyNow" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#D946EE] data-[state=active]:to-[#8B5CF6] data-[state=active]:text-white">
                  Buy Now
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <ProductGrid 
                products={products || []} 
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="auctions" className="mt-0">
              {auctionProducts.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Timer className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-amber-800">Dutch Auctions</h3>
                        <p className="text-sm text-gray-600">
                          Prices automatically decrease over time until someone makes a purchase.
                          The first buyer to act gets the deal!
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <ProductGrid 
                    products={auctionProducts} 
                    isLoading={isLoading}
                  />
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="bg-amber-100 p-4 rounded-full mb-4">
                    <TrendingDown className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Active Auctions</h3>
                  <p className="text-gray-500 max-w-md">
                    There are currently no active auctions. Check back soon or browse other products.
                  </p>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="buyNow" className="mt-0">
              <ProductGrid 
                products={regularProducts} 
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </MarketplaceLayout>
      <Footer />
    </div>
  );
};
