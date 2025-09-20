import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, CheckCircle, MessageSquare, BadgeCheck, Crown, User2, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/CleanAuthContext";
import { useNavigate } from "react-router-dom";
const PricingFees = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePackageSelection = (packageType: 'starter' | 'growth' | 'scale') => {
    if (user) {
      navigate(`/list-product?package=${packageType}`);
    } else {
      navigate(`/auth?redirect=/list-product?package=${packageType}`);
    }
  };
  return <section id="pricing-packages" className="py-0">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          {/* Card 1 - For Sellers (Free) */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }}>
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#FF3B81]/20 p-4 rounded-full">
                    <Tag className="h-8 w-8 text-[#FF3B81]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Choose Your Path to Listing</h3>
                <p className="text-center text-white/80 text-base mb-6">No matter your stage — early, growing, or established — you can list in minutes and set the rules.</p>
                
                <div className="space-y-6 flex-grow">
                  {/* Starter Package */}
                   <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300">
                     <div className="flex items-center justify-between mb-3">
                       <h4 className="text-lg font-bold text-white">Starter</h4>
                       <div className="px-3 py-1 rounded-full">
                         <span className="text-sm font-bold text-white">FREE</span>
                       </div>
                     </div>
                     <p className="text-white text-sm mb-3">For pre-revenue or idea-stage founders who want to test the waters. Account creation not required. (Limited analytics)</p>
                     <ul className="space-y-2 text-sm">
                       <li className="flex items-center text-white">
                         <CheckCircle className="h-4 w-4 text-[#10B981] mr-2 flex-shrink-0" />
                         <span>List your AI SaaS on the marketplace</span>
                       </li>
                       <li className="flex items-center text-white">
                         <CheckCircle className="h-4 w-4 text-[#10B981] mr-2 flex-shrink-0" />
                         <span>Commission-based only (no upfront fee)</span>
                       </li>
                       <li className="flex items-center text-white">
                         <CheckCircle className="h-4 w-4 text-[#10B981] mr-2 flex-shrink-0" />
                         <span>Get The Free Beginner's Guide to Selling AI SaaS + contract templates</span>
                       </li>
                     </ul>
                     <p className="text-amber-300 text-xs mt-2 font-medium">💡 Risk-free entry for early-stage founders</p>
                     
                     <div className="flex justify-center">
                        <Button onClick={() => handlePackageSelection('starter')} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-2 px-20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-shadow-sm">
                         Sell My AI SaaS
                       </Button>
                     </div>
                  </div>

                  {/* Growth Package */}
                  <div className="bg-white/5 p-4 rounded-lg border border-[#7C3AED]/30 relative hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300">
                    <div className="absolute -top-2 -right-2 bg-[#7C3AED] text-white text-xs font-bold px-2 py-1 rounded-full">
                      POPULAR
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">Growth</h4>
                      <div className="text-right">
                        <div className="px-3 py-1 rounded-full">
                          <span className="text-sm font-bold text-white">$199 - One Time Fee</span>
                        </div>
                        <p className="text-xs text-white mt-1">+ 5% success fee</p>
                      </div>
                    </div>
                    <p className="text-white text-sm mb-3">For bootstrapped founders who want exposure + resources.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-white">
                        <CheckCircle className="h-4 w-4 text-[#7C3AED] mr-2 flex-shrink-0" />
                        <span>Reduced Success Fees </span>
                      </li>
                       <li className="flex items-center text-white">
                         <CheckCircle className="h-4 w-4 text-[#7C3AED] mr-2 flex-shrink-0" />
                         <span>Featured in weekly newsletter, YouTube channel, and Slack buyer community</span>
                       </li>
                       <li className="flex items-center text-white">
                         <CheckCircle className="h-4 w-4 text-[#7C3AED] mr-2 flex-shrink-0" />
                         <span>Advanced Playbook: Exiting Your AI SaaS Faster — includes customizable contracts</span>
                       </li>
                       <li className="flex items-center text-white">
                         <CheckCircle className="h-4 w-4 text-[#7C3AED] mr-2 flex-shrink-0" />
                         <span>Personalized Exit Readiness Checklist (maximize valuation before selling)</span>
                       </li>
                    </ul>
                    <p className="text-green-400 text-xs mt-2 font-medium">💸 Risk-Free Listing Guarantee If your listing doesn’t generate buyer interest in 30 days, we’ll refund your fee. Simple as that.
                  </p>
                   
                   <div className="flex justify-center">
                     <Button onClick={() => handlePackageSelection('growth')} className="mt-4 bg-purple-500 hover:bg-purple-600 text-black font-extrabold py-2 px-20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-shadow-sm">
                       Sell My AI SaaS
                     </Button>
                   </div>
                   </div>

                  {/* Scale Package */}
                  <div className="bg-white/5 p-4 rounded-lg border border-amber-400/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">Scale</h4>
                      <div className="text-right">
                        <div className="px-3 py-1 rounded-full">
                          <span className="text-sm font-bold text-white">$2,500 - One Time Fee</span>
                        </div>
                        <p className="text-xs text-green-400 mt-1 font-medium">$0 success fees</p>
                      </div>
                    </div>
                    <p className="text-white text-sm mb-3">For serious founders who want premium positioning.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-white">
                        <Crown className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                        <span>Everything in Growth</span>
                      </li>
                      <li className="flex items-center text-white">
                        <CheckCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                        <span>Dedicated Sales Rep</span>
                      </li>
                      <li className="flex items-center text-white">
                        <CheckCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                        <span>Slack community AMA Hot Spot pitch</span>
                      </li>
                      <li className="flex items-center text-white">
                        <CheckCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                        <span>30-min Exit Strategy Call</span>
                      </li>
                      <li className="flex items-center text-white">
                        <BadgeCheck className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                        <span>Priority Placement</span>
                      </li>
                    </ul>
                     <p className="text-amber-300 text-xs mt-2 font-medium">💡 Maximum exposure + white-glove pitching</p>
                   
                   <div className="flex justify-center">
                     <Button onClick={() => handlePackageSelection('scale')} className="mt-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-2 px-20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-shadow-sm">
                       Sell My AI SaaS
                     </Button>
                   </div>
                   </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          
        </div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.4
      }} className="text-center mt-12">
          <p className="text-white max-w-2xl mx-auto my-[34px]">
            Your SaaS deserves real buyers, not tire-kickers. We put your business in front of investors ready to acquire today.
          </p>
        </motion.div>
      </div>
    </section>;
};
export default PricingFees;