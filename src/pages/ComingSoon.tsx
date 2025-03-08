
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Rocket, LineChart, Users } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { InvestorQuestionnaire } from "@/components/investor/InvestorQuestionnaire";
import { useIsMobile } from "@/hooks/use-mobile";

export const ComingSoon = () => {
  const [progress] = useState(80); // 800 out of 1000 spots taken
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 bg-white/90 rounded-xl shadow-xl p-4 md:p-8 backdrop-blur-sm">
          <Link to="/">
            <img 
              src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png" 
              alt="AI Exchange Logo" 
              className="h-16 md:h-24 w-16 md:w-24 mx-auto mb-4 md:mb-8 object-contain animate-float cursor-pointer hover:opacity-80 transition-opacity" 
            />
          </Link>

          <div className="text-center space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-5xl exo-2-heading font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">Marketplace Launches Soon</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Join an exclusive network of investors gaining early access to cutting-edge AI products, tools, and companies through our innovative auction marketplace.
            </p>
          </div>

          {/* Newsletter Signup - Moved up */}
          <div className="max-w-xl mx-auto space-y-4 md:space-y-6">
            <div className="text-center space-y-4">
              
            </div>

            <div className="text-sm text-gray-600 text-center">
              ✓ Premium deal flow &nbsp;{isMobile ? <br /> : "• "}&nbsp; 
              ✓ Market insights &nbsp;{isMobile ? <br /> : "• "}&nbsp; 
              ✓ Community access
            </div>

            {/* Newsletter Benefits */}
            <div className="space-y-3 bg-purple-50 p-4 md:p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 text-center">Why Join as an Investor?</h3>
              <ul className="space-y-2 text-gray-700 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-1">→</span>
                  <span className="text-xl md:text-3xl">Get Matched with AI SaaS Businesses for Sale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-1">→</span>
                  <span className="text-base md:text-lg">Exclusive deals and preferential pricing through auctions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-1">→</span>
                  <span className="text-base md:text-lg">Connect with fellow AI investors and industry leaders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-1">→</span>
                  <span className="text-base md:text-lg">Weekly curated insights on emerging AI opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Investor Questionnaire Section */}
          <div className="max-w-xl mx-auto py-6 md:py-8 space-y-4 md:space-y-6 border-t border-b border-purple-100">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold exo-2-heading bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">Get Matched with AI Investments</h2>
              <p className="text-gray-700 mt-2 text-sm md:text-base">Complete this quick questionnaire to be matched with AI products that fit your investment criteria when we launch.</p>
            </div>
            
            {showQuestionnaire ? (
              <InvestorQuestionnaire 
                variant="comingSoon" 
                showNewsletterButton={true} 
                onComplete={() => setShowQuestionnaire(false)} 
              />
            ) : (
              <Button 
                onClick={() => setShowQuestionnaire(true)} 
                className="w-full max-w-md mx-auto block bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] hover:opacity-90 text-white text-sm md:text-base"
              >
                Start Investment Matching Quiz
              </Button>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-8 md:my-12">
            <div className="bg-white/50 p-4 md:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#8B5CF6]" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Premium Deals</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600">Get exclusive first access to vetted AI companies and products before they hit the public market.</p>
            </div>

            <div className="bg-white/50 p-4 md:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <LineChart className="w-6 h-6 md:w-8 md:h-8 text-[#D946EF]" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Market Advantage</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600">Leverage our Dutch auction system to acquire valuable AI assets at optimal prices.</p>
            </div>

            <div className="bg-white/50 p-4 md:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-[#0EA5E9]" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Elite Network</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600">Connect with fellow AI investors and founders in our exclusive community.</p>
            </div>

            <div className="bg-white/50 p-4 md:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <Rocket className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Early Mover</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600">Be among the first to capitalize on emerging AI opportunities and trends.</p>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs md:text-sm">
            Already have an AI product to list?{" "}
            <Link to="/list-product" className="text-[#8B5CF6] hover:underline">
              List Your AI Product & Get Early Access to Investors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
