
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const FounderBuiltAroundYou = () => {
  const features = [
    "Want exposure to pre-vetted buyers who understand AI",
    "Prefer flexible pricing options (Dutch auction or fixed)",
    "Need simple tools to prep their listing without the M&A fluff"
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="mb-8">
          <span className="text-2xl mb-4 block">👋</span>
          <h2 className="exo-2-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built Around You — The AI Founder
          </h2>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            You're not a listing. You're a builder who deserves a fair, fast exit without wasting time.
          </p>
          
          <p className="text-lg text-gray-700 mb-8">
            At AIExchange.club, we designed a modern experience for AI founders who:
          </p>
          
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-[#D946EE]/10 via-[#8B5CF6]/10 to-[#0EA4E9]/10 rounded-lg p-6">
            <div className="space-y-2 text-gray-800 font-medium">
              <p>✓ We don't charge you to list.</p>
              <p>✓ We don't require exclusivity.</p>
              <p>✓ We do give you full control, support, and visibility.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
