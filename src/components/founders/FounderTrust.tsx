
import { motion } from "framer-motion";
import { Shield, Eye, Users, Heart } from "lucide-react";

export const FounderTrust = () => {
  const trustPoints = [
    {
      icon: Eye,
      text: "Transparent, no-pressure process"
    },
    {
      icon: Shield,
      text: "No listing fees, no hidden catches"
    },
    {
      icon: Users,
      text: "Real-time support from a founder-led team"
    },
    {
      icon: Heart,
      text: "Built for AI SaaS — not generic tech startups"
    }
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
          <span className="text-2xl mb-4 block">🔒</span>
          <h2 className="exo-2-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Founders Trust Us
          </h2>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {trustPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-left"
              >
                <div className="p-2 rounded-full bg-gradient-to-r from-[#D946EE]/10 via-[#8B5CF6]/10 to-[#0EA4E9]/10">
                  <point.icon className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <span className="text-gray-700">{point.text}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-[#D946EE]/10 via-[#8B5CF6]/10 to-[#0EA4E9]/10 rounded-lg p-6">
            <p className="text-lg font-semibold text-gray-800">
              You're not just another deal. You're our entire focus.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
