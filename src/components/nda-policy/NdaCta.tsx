
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NdaCta = () => {
  return (
    <div className="mt-16 bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#0EA4E9] p-8 md:p-12 rounded-xl shadow-lg text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDAgQzY5LjQgMCA0NC44IDI0LjYgNDQuOCA1NS4yIEM0NC44IDg1LjggNjkuNCAxMTAuNCAxMDAgMTEwLjQgQzEzMC42IDExMC40IDE1NS4yIDg1LjggMTU1LjIgNTUuMiBDMTU1LjIgMjQuNiAxMzAuNiAwIDEwMCAwIFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 exo-2-heading">Ready to List Your AI Product?</h2>
          <p className="text-white/90 max-w-xl">
            List your AI business with confidence, knowing that your confidential information is protected by our 
            comprehensive NDA system.
          </p>
        </div>
        <Link to="/list-product">
          <Button className="bg-white hover:bg-gray-100 text-[#8B5CF6] px-8 py-6 text-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            List Your Product
          </Button>
        </Link>
      </div>
    </div>
  );
};
