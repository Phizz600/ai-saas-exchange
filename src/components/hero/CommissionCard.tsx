import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Percent, CheckCircle, Calculator, Star } from "lucide-react";

const CommissionCard = () => {
  const commissionTiers = [
    { range: "$0 - $10,000", rate: "10%", icon: "💼" },
    { range: "$10,001 - $50,000", rate: "8%", icon: "📈" },
    { range: "$50,001 - $100,000", rate: "6%", icon: "🚀", bestValue: true },
    { range: "$100,001+", rate: "5%", icon: "🏆", bestValue: true }
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
          <h2 className="text-3xl font-bold text-white mb-4 exo-2-heading">
            Success fee/ Commission
          </h2>
          
          {/* Subtext */}
          <p className="text-white/70 text-lg mb-8">
            Only pay when your business sells — no upfront fees.
          </p>

          {/* Commission Table */}
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/20">
                  Deal Size
                </h3>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/20">
                  Rate
                </h3>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/20">
                  Value
                </h3>
              </div>
            </div>
            
            {commissionTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 gap-4 py-4 border-b border-white/10 last:border-b-0 rounded-lg transition-all duration-200 hover:bg-white/5 ${
                  tier.bestValue ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 relative' : ''
                }`}
              >
                {tier.bestValue && (
                  <div className="absolute -top-2 right-2">
                    <div className="bg-[#8B5CF6] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Best Deal
                    </div>
                  </div>
                )}
                <div className="text-left text-white/80 flex items-center gap-2">
                  <span className="text-lg">{tier.icon}</span>
                  {tier.range}
                </div>
                <div className="text-center text-white font-bold text-xl">
                  {tier.rate}
                </div>
                <div className="text-right text-white/70 text-sm">
                  {tier.bestValue ? '⭐ Premium' : 'Standard'}
                </div>
              </div>
            ))}
          </div>

          {/* Example Calculation */}
          <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-5 w-5 text-[#8B5CF6]" />
              <h4 className="text-white font-semibold">Example Calculation</h4>
            </div>
            <p className="text-white/80 text-sm">
              Sell your AI SaaS for <span className="font-bold text-white">$75,000</span> → Pay only <span className="font-bold text-[#8B5CF6]">6% = $4,500</span>
            </p>
            <p className="text-white font-semibold mt-1">
              You keep <span className="text-[#0EA4E9]">$70,500</span>
            </p>
          </div>

          {/* Updated Description */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center justify-center gap-2">
              📊 Transparent, Performance-Based Pricing
            </h3>
            <p className="text-white/80 leading-relaxed">
              You only pay when you succeed — and the more you sell, the less you pay.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-white/90">
              <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-3 flex-shrink-0" />
              <span>Lower commissions on higher-value deals</span>
            </div>
            <div className="flex items-center text-white/90">
              <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-3 flex-shrink-0" />
              <span>No upfront fees, no surprises — ever</span>
            </div>
            <div className="flex items-center text-white/90">
              <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-3 flex-shrink-0" />
              <span>Success fee only charged to sellers after verified deal closes</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
            onClick={() => window.location.href = '/'}
          >
            🔍 See What Your Business Could Be Worth
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CommissionCard;