
import { CircuitBoard, Users, MessageSquare } from "lucide-react";

const FeatureHighlights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up"
         style={{ animationDelay: '0.6s' }}>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <CircuitBoard className="h-8 w-8 mb-4 mx-auto text-[#D946EF]" />
        <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Valuations</h3>
        <p className="text-gray-300">Get accurate, data-driven valuations for your SaaS company</p>
      </div>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <Users className="h-8 w-8 mb-4 mx-auto text-[#8B5CF6]" />
        <h3 className="text-lg font-semibold text-white mb-2">Curated Deal Flow</h3>
        <p className="text-gray-300">Access high-quality, pre-verified AI SaaS opportunities</p>
      </div>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <MessageSquare className="h-8 w-8 mb-4 mx-auto text-[#0EA5E9]" />
        <h3 className="text-lg font-semibold text-white mb-2">Private Buyer Community</h3>
        <p className="text-gray-300">Join our exclusive network of verified AI investors</p>
      </div>
    </div>
  );
};

export default FeatureHighlights;
