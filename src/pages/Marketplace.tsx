
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Footer } from "@/components/Footer";

export function Marketplace() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <MarketplaceLayout />
      <Footer />
    </div>
  );
}

// Default export for lazy loading
export default Marketplace;
