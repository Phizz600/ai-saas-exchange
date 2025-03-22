
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FAQConversionCTA = () => {
  return (
    <div className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 backdrop-blur-sm rounded-xl p-8 mt-16 max-w-5xl mx-auto text-center">
      <h2 className="exo-2-heading text-2xl md:text-3xl font-bold text-white mb-4">
        Ready to get started?
      </h2>
      <p className="text-white/80 mb-8 max-w-2xl mx-auto">
        Whether you're looking to buy or sell AI tools, AI Exchange Club provides the most secure and efficient marketplace.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/marketplace">
          <Button 
            className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white py-6 px-8 text-lg font-medium w-full sm:w-auto"
          >
            Browse AI Tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
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
