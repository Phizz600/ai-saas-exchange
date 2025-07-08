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
          <h4 className="text-xl font-semibold text-white">Why Founders Choose AIExchange.club to Sell Their AI SaaS</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#D946EE] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Flexible Exit Options</h5>
                <p className="text-gray-300">Whether you want to set a fixed price or use our Dutch auction format, you’re in control of how your business is priced and sold.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#D946EE] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Qualified, Serious Buyers</h5>
                <p className="text-gray-300">Your listing gets shared directly with serious, pre-vetted buyers inside our private Slack deal rooms—no tire-kickers, just qualified interest.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Done-for-You Deal Facilitation</h5>
                <p className="text-gray-300">From vetting calls and due diligence to legal docs and Escrow.com setup—we handle the hard stuff so you can focus on the exit.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Premium Network Access</h5>
                <p className="text-gray-300">Join our exclusive community of AI founders and gain access to investor networks, technical advisors, and ongoing support.</p>
              </div>
            </div>
          </div>
          
          <Link to="/list-product">
            <Button variant="default" className="w-full mt-2 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#C836DD] hover:to-[#7A4CE5]">
              List Your AI Business
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isBuyerOpen} onOpenChange={setIsBuyerOpen} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transition-all duration-300 hover:bg-white/15">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-2xl font-bold text-white exo-2-heading">For Buyers</h3>
          <ChevronDown className={`w-6 h-6 text-white transition-transform duration-300 ${isBuyerOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          <h4 className="text-xl font-semibold text-white">Why Bid on AI Assets Here</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#0EA4E9] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">First-Mover Advantage</h5>
                <p className="text-gray-300">Acquire cutting-edge AI solutions before your competitors even know they exist. Our Dutch auction model rewards decisive action.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#0EA4E9] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Verified Quality</h5>
                <p className="text-gray-300">Every listed business undergoes thorough technical, financial, and market validation by our expert team before being approved.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Transparent Due Diligence</h5>
                <p className="text-gray-300">Access comprehensive data, metrics, and documentation for each listing including traffic analytics, customer retention, and revenue models.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white">Secure Acquisition Process</h5>
                <p className="text-gray-300">Our platform provides secure payment processing, escrow services, and post-purchase transition support to ensure a smooth handover.</p>
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