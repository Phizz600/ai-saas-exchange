
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const FAQConversionCTA = () => {
  // Check if marketplace is live
  const marketplaceLaunchDate = new Date("2024-05-01");
  const isMarketplaceLive = new Date() >= marketplaceLaunchDate;
  
  // Format the date for display
  const formattedLaunchDate = marketplaceLaunchDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 backdrop-blur-sm rounded-xl p-8 mt-16 max-w-5xl mx-auto text-center">
      <h2 className="exo-2-heading text-2xl md:text-3xl font-bold text-white mb-4">
        Ready to get started?
      </h2>
      <p className="text-white/80 mb-8 max-w-2xl mx-auto">
        Whether you're looking to buy or sell AI tools, AI Exchange Club provides the most secure and efficient marketplace.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  className={`bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white py-6 px-8 text-lg font-medium w-full sm:w-auto relative flex items-center ${!isMarketplaceLive ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 transition-opacity'}`}
                  disabled={!isMarketplaceLive}
                >
                  Browse AI Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                  {!isMarketplaceLive && (
                    <span className="absolute -top-2 -right-2">
                      <Info className="h-5 w-5 text-white/90" />
                    </span>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {!isMarketplaceLive && (
              <TooltipContent side="top" className="bg-black/90 text-white border-gray-700 p-3 max-w-xs">
                <p>Marketplace launches on {formattedLaunchDate}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <Link to="/list-product">
          <Button
            variant="outline"
            className="bg-white/10 border-[#0EA4E9] border-2 text-white hover:bg-white/20 py-6 px-8 text-lg font-medium w-full sm:w-auto shadow-lg"
          >
            List Your Product
          </Button>
        </Link>
      </div>
    </div>
  );
};
