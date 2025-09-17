import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, CheckCircle, MessageSquare, BadgeCheck, Crown, User2, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingFees = () => {
  return <section className="py-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
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
                <h3 className="text-center text-2xl font-bold text-white mb-4">$0 Listing Fee</h3>
                
                <div className="relative mb-6">
                  <p className="text-center text-lg font-bold text-white">FREE</p>
                  <div className="absolute -top-3 -right-2 bg-[#0EA4E9] text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                    Offer Ends Soon
                  </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-md mb-6">
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-2">
                    <User2 className="h-4 w-4" />
                    <p className="text-sm font-medium">Early Adopter Benefit</p>
                  </div>
                  <p className="text-gray-300 text-sm text-center">List your AI SaaS completely free - no upfront costs, no commissions, no broker fees.</p>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  Get your AI business in front of qualified buyers through our private buyer network.
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#D946EE] mr-2" />
                    <span>Free listing submission</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#D946EE] mr-2" />
                    <span>Direct buyer connections</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#D946EE] mr-2" />
                    <span>No commission on deals</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">You handle your own negotiations</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Card 2 - Private Buyer Network Access */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#8B5CF6]/20 p-4 rounded-full">
                    <MessageSquare className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Marketplace Access</h3>
                
                <div className="mb-6">
                  <div className="text-lg font-bold text-white mb-3 text-center">Choose Your Plan</div>
                  <div className="space-y-2">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 cursor-pointer">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white">3 Months</span>
                        <div className="text-right">
                          <div className="text-white font-semibold">$600</div>
                          <div className="text-xs text-gray-400">$200/mo</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/50 hover:shadow-lg hover:shadow-[#8B5CF6]/20 transition-all duration-300 cursor-pointer">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white">6 Months</span>
                        <div className="text-right">
                          <div className="text-white font-semibold">$1,080</div>
                          <div className="text-xs text-green-400">$180/mo</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white">12 Months</span>
                        <div className="text-right">
                          <div className="text-white font-semibold">$1,920</div>
                          <div className="text-xs text-green-400">$160/mo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-md mb-6">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <Users className="h-4 w-4" />
                    <p className="text-sm font-medium">200+ Active Buyers</p>
                  </div>
                  <p className="text-gray-300 text-sm text-center">
                    Join our exclusive community of AI SaaS investors and get deal flow delivered daily
                  </p>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">Access our private buyer marketplace with curated DFaaS (Dealflow as a Service) and direct seller communications.</p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2" />
                    <span>Daily deal notifications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2" />
                    <span>Pre-vetted listings only</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2" />
                    <span>Direct seller introductions</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">Private deal discussion rooms</span>
                  </li>
                </ul>
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
            No brokering. No fluff. Just vetted deal flow delivered to serious investors who are ready to acquire AI SaaS businesses.
          </p>
        </motion.div>
      </div>
    </section>;
};

export default PricingFees;
