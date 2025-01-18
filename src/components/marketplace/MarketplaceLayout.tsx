import { Header } from "@/components/Header";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { LiveChatButton } from "@/components/LiveChatButton";

export const MarketplaceLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-52 px-4 md:px-8">
        <FeaturedCompaniesSlideshow />
        <MarketplaceContent />
        <MarketplaceFAQ />
        <MarketplaceFooter />
        <LiveChatButton />
      </div>
    </div>
  );
};