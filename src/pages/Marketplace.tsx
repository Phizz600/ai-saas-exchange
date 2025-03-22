
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Footer } from "@/components/Footer";

export const Marketplace = () => {
  console.log('Marketplace page component rendered');
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <MarketplaceLayout />
      <Footer />
    </div>
  );
};
