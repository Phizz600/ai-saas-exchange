import { Header } from "@/components/Header";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { LiveChatButton } from "@/components/LiveChatButton";
import { MarketplaceBreadcrumb } from "@/components/marketplace/MarketplaceBreadcrumb";

export const MarketplaceLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-52 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <MarketplaceBreadcrumb />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Products Marketplace</h1>
          <p className="text-gray-600 mb-8">Discover and acquire cutting-edge AI solutions for your business</p>
          <FeaturedCompaniesSlideshow />
          <MarketplaceContent />
          <MarketplaceFAQ />
          <MarketplaceFooter />
          <LiveChatButton />
        </div>
      </div>
    </div>
  );
};