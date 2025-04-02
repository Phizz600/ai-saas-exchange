
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NdaCta = () => {
  return (
    <div className="mt-16 bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] p-8 md:p-12 rounded-xl shadow-lg text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 exo-2-heading">Ready to List Your AI Product?</h2>
          <p className="text-white/90 max-w-xl">
            List your AI business with confidence, knowing that your confidential information is protected by our 
            comprehensive NDA system.
          </p>
        </div>
        <Link to="/list-product">
          <Button className="bg-white text-[#8B5CF6] hover:bg-gray-100 px-8 py-6 text-lg shadow-md">
            List Your Product
          </Button>
        </Link>
      </div>
    </div>
  );
};
