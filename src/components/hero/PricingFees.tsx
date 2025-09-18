import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, CheckCircle, MessageSquare, BadgeCheck, Crown, User2, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
const PricingFees = () => {
  return <section className="py-0">
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
                  <div className="bg-[#D946EE]/20 p-4 rounded-full">
                    <Tag className="h-8 w-8 text-[#D946EE]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-6">Founder/Seller Listing Packages</h3>
                
                <div className="space-y-6 flex-grow">
                  {/* Starter Package */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:shadow-[0_0_30px_rgba(217,70,238,0.3)] transition-all duration-300 cursor-pointer" onClick={() => window.open('https://airtable.com/appqbmIOXXLNFhZyj/pagutIK7nf0unyJm3/form', '_blank')}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">Starter</h4>
                      <span className="text-lg font-bold text-[#D946EE]">FREE</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">For pre-revenue or idea-stage founders who want to test the waters. Account creation not required. (Limited analytics)</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#D946EE] mr-2 flex-shrink-0" />
                        <span>List your AI SaaS on the marketplace</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#D946EE] mr-2 flex-shrink-0" />
                        <span>Commission-based only (no upfront fee)</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#D946EE] mr-2 flex-shrink-0" />
                        <span>Get The Free Beginner's Guide to Selling AI SaaS + contract templates</span>
                      </li>
                    </ul>
                    <p className="text-amber-300 text-xs mt-2 font-medium">💡 Risk-free entry for early-stage founders</p>
                    
                    <div className="flex justify-center">
                      <Button onClick={e => {
                      e.stopPropagation();
                      window.open('https://airtable.com/appqbmIOXXLNFhZyj/pagutIK7nf0unyJm3/form', '_blank');
                    }} className="mt-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-2 px-20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        Sell My AI SaaS
                      </Button>
                    </div>
                  </div>

                  {/* Growth Package */}
                  <div className="bg-white/5 p-4 rounded-lg border border-[#8B5CF6]/30 relative hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300">
                    <div className="absolute -top-2 -right-2 bg-[#8B5CF6] text-white text-xs font-bold px-2 py-1 rounded-full">
                      POPULAR
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">Growth</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#8B5CF6]">$199</span>
                        <p className="text-xs text-gray-400">+ 5% success fee</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">For bootstrapped founders who want exposure + resources.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#8B5CF6] mr-2 flex-shrink-0" />
                        <span>Reduced Success Fees </span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#8B5CF6] mr-2 flex-shrink-0" />
                        <span>Featured in weekly newsletter, YouTube channel, and Slack buyer community</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#8B5CF6] mr-2 flex-shrink-0" />
                        <span>Advanced Playbook: Exiting Your AI SaaS Faster — includes customizable contracts</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#8B5CF6] mr-2 flex-shrink-0" />
                        <span>Personalized Exit Readiness Checklist (maximize valuation before selling)</span>
                      </li>
                    </ul>
                    <p className="text-green-400 text-xs mt-2 font-medium">💸 Risk-Free Listing Guarantee If your listing doesn’t generate buyer interest in 30 days, we’ll refund your fee. Simple as that.
                  </p>
                  </div>

                  {/* Scale Package */}
                  <div className="bg-white/5 p-4 rounded-lg border border-[#0EA4E9]/30 hover:shadow-[0_0_30px_rgba(14,164,233,0.4)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">Scale</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#0EA4E9]">$2,500</span>
                        <p className="text-xs text-green-400">$0 success fees</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">For serious founders who want premium positioning.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-gray-300">
                        <Crown className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                        <span>Everything in Growth</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#0EA4E9] mr-2 flex-shrink-0" />
                        <span>Dedicated Sales Rep</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#0EA4E9] mr-2 flex-shrink-0" />
                        <span>Slack AMA Hot Spot — live 15-min pitch to buyers in private Slack voice channel</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-[#0EA4E9] mr-2 flex-shrink-0" />
                        <span>30-Minute Exit Strategy Call — tailored guidance to position for higher valuation</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <BadgeCheck className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                        <span>Priority Placement — top exposure across newsletter, Slack, and YouTube features</span>
                      </li>
                    </ul>
                    <p className="text-amber-300 text-xs mt-2 font-medium">💡 Maximum exposure + white-glove pitching</p>
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
          <p className="text-gray-300 max-w-2xl mx-auto my-[34px]">
            Your SaaS deserves real buyers, not tire-kickers. We put your business in front of investors ready to acquire today.
          </p>
        </motion.div>
      </div>
    </section>;
};
export default PricingFees;