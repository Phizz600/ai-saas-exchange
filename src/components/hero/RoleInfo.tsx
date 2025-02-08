
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface RoleInfoProps {
  isSellerOpen: boolean;
  setIsSellerOpen: (open: boolean) => void;
  isBuyerOpen: boolean;
  setIsBuyerOpen: (open: boolean) => void;
}

const RoleInfo = ({ isSellerOpen, setIsSellerOpen, isBuyerOpen, setIsBuyerOpen }: RoleInfoProps) => {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Collapsible
        open={isSellerOpen}
        onOpenChange={setIsSellerOpen}
        className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transition-all duration-300 hover:bg-white/15"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-2xl font-bold text-white">For Sellers</h3>
          <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isSellerOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <h4 className="text-xl font-semibold text-white">Why Dutch Auctions Work for AI Startups</h4>
          <ul className="space-y-3 text-gray-300">
            <li>• Avoid undervaluation with a transparent pricing model</li>
            <li>• Attract serious buyers racing to buy your AI SaaS product</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={isBuyerOpen}
        onOpenChange={setIsBuyerOpen}
        className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transition-all duration-300 hover:bg-white/15"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-2xl font-bold text-white">For Buyers</h3>
          <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isBuyerOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <h4 className="text-xl font-semibold text-white">Why Bid on AI Assets Here</h4>
          <ul className="space-y-3 text-gray-300">
            <li>• Acquire undervalued AI SaaS products before competitors</li>
            <li>• No bidding wars, first to act wins</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RoleInfo;
