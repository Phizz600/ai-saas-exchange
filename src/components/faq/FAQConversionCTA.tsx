
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const FAQConversionCTA = () => {
  return (
    <div className="mt-20 bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 rounded-xl p-8 text-center">
      <h2 className="exo-2-heading text-2xl font-bold text-white mb-4">
        Ready to join the AI Exchange Club?
      </h2>
      
      <p className="text-white/80 max-w-2xl mx-auto mb-8">
        Whether you're looking to sell your AI SaaS product or searching for your next acquisition, 
        our platform provides the tools and security you need for a successful transaction.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/auth" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Join Now <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        
        <Link 
          to="/contact" 
          className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};
