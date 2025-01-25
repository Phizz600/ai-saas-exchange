import { Button } from "@/components/ui/button";
import { MarketplaceContent } from "./MarketplaceContent";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const MarketplaceLayout = () => {
  console.log('MarketplaceLayout component rendered');
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">AI Products Marketplace</h1>
            <Link to="/list-product">
              <Button 
                className="hidden sm:flex bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
              >
                <Plus className="mr-2 h-4 w-4" /> List Your Product
              </Button>
              <Button 
                className="sm:hidden bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <MarketplaceContent />
        </div>
      </div>
      <MarketplaceFooter />
    </div>
  );
};