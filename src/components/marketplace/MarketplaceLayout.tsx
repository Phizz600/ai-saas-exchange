import { Header } from "@/components/Header";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { LiveChatButton } from "@/components/LiveChatButton";
import { MarketplaceBreadcrumb } from "@/components/marketplace/MarketplaceBreadcrumb";
import { useEffect } from "react";

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
          <div className="max-w-7xl mx-auto space-y-8">
            <MarketplaceBreadcrumb />
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                AI Products Marketplace
              </h1>
              <p className="text-lg text-gray-600">
                Discover and acquire cutting-edge AI solutions for your business
              </p>
            </div>
            <FeaturedCompaniesSlideshow />
            <MarketplaceContent />
            <MarketplaceFAQ />
          </div>
        </div>
      </main>
      <MarketplaceFooter />
      <LiveChatButton />
    </div>
  );
};