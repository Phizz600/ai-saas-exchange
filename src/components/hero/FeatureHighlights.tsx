import { CircuitBoard, Brain, Network } from "lucide-react";
import { motion } from "framer-motion";

export const FeatureHighlights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
    >
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <CircuitBoard className="h-8 w-8 mb-4 mx-auto text-[#D946EF]" />
        <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Valuations</h3>
        <p className="text-gray-300">Get accurate, data-driven valuations for your SaaS company</p>
      </div>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <Brain className="h-8 w-8 mb-4 mx-auto text-[#8B5CF6]" />
        <h3 className="text-lg font-semibold text-white mb-2">Smart Matching</h3>
        <p className="text-gray-300">Connect with the perfect investors using our AI algorithm</p>
      </div>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <Network className="h-8 w-8 mb-4 mx-auto text-[#0EA5E9]" />
        <h3 className="text-lg font-semibold text-white mb-2">Premium Network</h3>
        <p className="text-gray-300">Access our exclusive network of verified buyers and sellers</p>
      </div>
    </motion.div>
  );
};