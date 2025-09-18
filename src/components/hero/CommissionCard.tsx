import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Percent, CheckCircle } from "lucide-react";

const CommissionCard = () => {
  const commissionTiers = [
    { range: "$0 - $10,000", rate: "10%" },
    { range: "$10,001 - $50,000", rate: "8%" },
    { range: "$50,001 - $100,000", rate: "6%" },
    { range: "$100,001+", rate: "5%" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="container mx-auto px-4 mt-16 mb-16"
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/5 p-8 rounded-xl max-w-2xl mx-auto">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#8B5CF6]/20 p-4 rounded-full">
              <Percent className="h-8 w-8 text-[#8B5CF6]" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-8 exo-2-heading">
            Commission
          </h2>

          {/* Commission Table */}
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/20">
                  Price Range
                </h3>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/20">
                  Rate
                </h3>
              </div>
            </div>
            
            {commissionTiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-white/10 last:border-b-0">
                <div className="text-left text-white/80">
                  {tier.range}
                </div>
                <div className="text-right text-white font-semibold">
                  {tier.rate}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/80 text-center mb-6 leading-relaxed">
            Pay less as you sell more with our transparent tiered pricing structure.
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center text-white/90">
              <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-3 flex-shrink-0" />
              <span>Lower rates for higher-value deals</span>
            </div>
            <div className="flex items-center text-white/90">
              <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-3 flex-shrink-0" />
              <span>No hidden fees or surprises</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CommissionCard;