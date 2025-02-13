
import { Header } from "@/components/Header";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { LiveChatButton } from "@/components/LiveChatButton";
import { MarketplaceBreadcrumb } from "@/components/marketplace/MarketplaceBreadcrumb";
import { TrustBoosters } from "@/components/marketplace/trust/TrustBoosters";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export const MarketplaceLayout = () => {
  useEffect(() => {
    console.log('MarketplaceLayout mounted');
    console.log('Checking component imports:', {
      Header: !!Header,
      FeaturedCompaniesSlideshow: !!FeaturedCompaniesSlideshow,
      MarketplaceContent: !!MarketplaceContent,
      MarketplaceFAQ: !!MarketplaceFAQ,
      MarketplaceFooter: !!MarketplaceFooter,
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow w-full mt-16">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <MarketplaceBreadcrumb />
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                AI Products Marketplace
              </h1>
              <p className="text-lg text-gray-600">
                Discover and acquire cutting-edge AI solutions for your business
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/product-dashboard" className="hidden sm:block">
                <Button variant="outline">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/list-product">
                <Button 
                  className="hidden sm:flex bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  List Your Product
                </Button>
                <Button 
                  className="sm:hidden bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="max-w-none space-y-12">
            <FeaturedCompaniesSlideshow />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-lg">Escrow Protected</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Your payment is held securely until the transfer is complete
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-lg">100% Verified Listings</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Every product undergoes thorough verification
                </p>
              </div>
            </div>
            <MarketplaceContent />
            <TrustBoosters />
            <MarketplaceFAQ />
          </div>
        </div>
      </main>
      <MarketplaceFooter />
      <LiveChatButton />
    </div>
  );
};
