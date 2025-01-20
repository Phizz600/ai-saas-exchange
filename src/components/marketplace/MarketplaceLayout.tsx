import { Header } from "@/components/Header";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { LiveChatButton } from "@/components/LiveChatButton";
import { MarketplaceBreadcrumb } from "@/components/marketplace/MarketplaceBreadcrumb";

export const MarketplaceLayout = () => {
  console.log('Rendering MarketplaceLayout');
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 md:px-8">
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
      </main>
      <MarketplaceFooter />
      <LiveChatButton />
    </div>
  );
};