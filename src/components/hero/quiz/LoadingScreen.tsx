
import { LoaderCircle } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <LoaderCircle className="h-12 w-12 text-[#818CF8] animate-spin" />
      <h3 className="text-xl font-semibold text-[#818CF8]">
        Calculating Your AI SaaS Valuation
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        Our AI is analyzing your responses and current market data to generate your personalized valuation...
      </p>
    </div>
  );
};
