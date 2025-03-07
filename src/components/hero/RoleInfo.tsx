
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface RoleInfoProps {
  isSellerOpen: boolean;
  setIsSellerOpen: (open: boolean) => void;
  isBuyerOpen: boolean;
  setIsBuyerOpen: (open: boolean) => void;
}

const RoleInfo = ({ isSellerOpen, setIsSellerOpen, isBuyerOpen, setIsBuyerOpen }: RoleInfoProps) => {
  return (
    <div className="relative z-10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold text-white mb-10 exo-2-heading"
      >
        Who We Serve
      </motion.h2>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Collapsible
            open={isSellerOpen}
            onOpenChange={setIsSellerOpen}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/15 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="text-2xl font-bold text-white">For Sellers</h3>
              <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isSellerOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 animate-accordion-down">
              <h4 className="text-xl font-semibold text-white">Why Dutch Auctions Work for AI Startups</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] mr-2"></span>
                  <span>Avoid undervaluation with a transparent pricing model</span>
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] mr-2"></span>
                  <span>Attract serious buyers racing to buy your AI SaaS product</span>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Collapsible
            open={isBuyerOpen}
            onOpenChange={setIsBuyerOpen}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/15 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="text-2xl font-bold text-white">For Buyers</h3>
              <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isBuyerOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 animate-accordion-down">
              <h4 className="text-xl font-semibold text-white">Why Bid on AI Assets Here</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] mr-2"></span>
                  <span>Acquire undervalued AI SaaS products before competitors</span>
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] mr-2"></span>
                  <span>No bidding wars, first to act wins</span>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleInfo;
