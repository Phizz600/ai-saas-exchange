
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Footer } from "@/components/Footer";

export const Marketplace = () => {
  console.log('Marketplace page component rendered');
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <MarketplaceLayout />
      <Footer />
      <div className="w-full py-4 bg-blue-50 text-center text-gray-500 text-sm">
        © 2025 AI Exchange Club. All rights reserved.
      </div>
    </div>
  );
};
