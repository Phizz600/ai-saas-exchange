
import { Link } from "react-router-dom";

export const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9] flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-white/90 rounded-xl shadow-xl backdrop-blur-sm text-center">
        <Link to="/">
          <img 
            src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png"
            alt="AI Exchange Logo"
            className="w-24 h-24 mx-auto mb-8 object-contain animate-float cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        <h1 className="text-4xl font-exo font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text mb-6">
          Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The Investor portal is currently under development. We're working hard to bring you the best AI investment opportunities.
        </p>
        <p className="text-gray-500">
          In the meantime, you can{" "}
          <Link to="/auth" className="text-[#8B5CF6] hover:underline">
            sign up as a Builder
          </Link>
          {" "}to list your AI products.
        </p>
      </div>
    </div>
  );
};
