
import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export const ListProduct = () => {
  console.log('ListProduct page rendered');
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      {/* Promotional Banner */}
      <div className="w-full bg-black text-white py-3 text-center text-sm sm:text-base font-medium px-4">
        🚀 Early Bird Special: $10 Listing Fee (90% Off)! Lock in $10 for Life - Fee Jumps to $100 After Launch
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6 bg-white/90 rounded-xl shadow-xl p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Link to="/">
              <img src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png" alt="AI Exchange Logo" className="w-20 h-20 object-contain animate-float" />
            </Link>
            <h1 className="text-4xl font-exo font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
              List Your AI Product
            </h1>
            <p className="text-gray-600 text-center max-w-xl">
              Complete this form with detailed and accurate information to showcase your product's value and increase buyer interest.
            </p>
            <p className="text-gray-600 text-center text-xs">Estimated completion time: 5-10 minutes</p>
          </div>
          <ListProductForm />
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="fixed bottom-6 right-6 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors">
              <HelpCircle className="h-6 w-6 text-[#8B5CF6]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs bg-white">
            <p>Need help listing your product? Contact our support team at support@aiexchange.com</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
