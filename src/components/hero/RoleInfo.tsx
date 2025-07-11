
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
interface RoleInfoProps {
  isSellerOpen: boolean;
  setIsSellerOpen: (open: boolean) => void;
  isBuyerOpen: boolean;
  setIsBuyerOpen: (open: boolean) => void;
}
const RoleInfo = ({
  isSellerOpen,
  setIsSellerOpen,
  isBuyerOpen,
  setIsBuyerOpen
}: RoleInfoProps) => {
  return <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Collapsible open={isSellerOpen} onOpenChange={setIsSellerOpen} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transition-all duration-300 hover:bg-white/15">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-2xl font-bold text-white exo-2-heading">For Sellers</h3>
          <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isSellerOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          <h4 className="text-xl font-semibold text-white">Why List Your AI SaaS with AIExchange.club</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#D946EE] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">100% Free Listings</h5>
                <p className="text-gray-300">No upfront costs, no commission until you successfully sell your business.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#D946EE] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Direct Buyer Access</h5>
                <p className="text-gray-300">Connect directly with pre-qualified buyers in our private Slack community.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Quality Curation</h5>
                <p className="text-gray-300">We verify and curate listings to ensure they reach serious, qualified buyers only.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">You Stay in Control</h5>
                <p className="text-gray-300">Negotiate directly with buyers and complete deals on your own terms.</p>
              </div>
            </div>
          </div>
          
          <a href="https://airtable.com/appqbmIOXXLNFhZyj/pagutIK7nf0unyJm3/form" target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="w-full mt-2 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#C836DD] hover:to-[#7A4CE5]">
              List Your AI Business (FREE)
            </Button>
          </a>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isBuyerOpen} onOpenChange={setIsBuyerOpen} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transition-all duration-300 hover:bg-white/15">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-2xl font-bold text-white exo-2-heading">For Buyers</h3>
          <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isBuyerOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          <h4 className="text-xl font-semibold text-white">Why Join Our Buyer Community</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#0EA4E9] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Exclusive Deal Flow Access</h5>
                <p className="text-gray-300">Get first access to curated AI SaaS opportunities before they hit the broader market.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#0EA4E9] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Private Slack Community</h5>
                <p className="text-gray-300">Join our exclusive network of AI investors and get deal updates in real-time.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Pre-Verified Listings</h5>
                <p className="text-gray-300">Every opportunity is manually reviewed and verified before being shared.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Direct Seller Contact</h5>
                <p className="text-gray-300">Connect directly with founders and negotiate deals on your own terms.</p>
              </div>
            </div>
          </div>
          
          <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button variant="default" className="w-full mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] hover:from-[#7A4CE5] hover:to-[#0D93D8]">
              Join Our Buyer Network
            </Button>
          </a>
        </CollapsibleContent>
      </Collapsible>
    </div>;
};
export default RoleInfo;
