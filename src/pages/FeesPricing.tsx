import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, PercentIcon, CheckCircle, User, Crown, BadgeCheck, Users, Tag } from "lucide-react";
import PricingFees from "@/components/hero/PricingFees";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
export const FeesPricing = () => {
  // Animation variants
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return <AnimatedGradientBackground>
      <Navbar />
      
      <div className="pt-24 pb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container mx-auto px-4 text-center mb-12 my-[50px]">
          <h1 className="exo-2-heading text-5xl font-bold text-white mb-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] inline-block text-transparent bg-clip-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Our fair fee structure is designed to help you maximize your profits while ensuring 
            a smooth and secure transaction experience.
          </p>
        </motion.div>

        {/* Main content */}
        <PricingFees />
        
        <motion.div className="container mx-auto px-4 mt-20" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3,
        duration: 0.6
      }}>
          <Card className="bg-white/10 backdrop-blur-sm border-white/5 p-8 rounded-xl">
            {/* Pro Membership Details Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 exo-2-heading flex items-center">
                <Crown className="h-6 w-6 text-amber-400 mr-3" />
                Pro Membership Benefits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Exclusive Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">3 Code Audits Per Year</span>
                        <p className="text-gray-400 text-sm mt-1">Our technical team will review your AI product's code for security, performance, and quality issues.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">Dedicated Account Manager</span>
                        <p className="text-gray-400 text-sm mt-1">Get personalized assistance with all aspects of your buying or selling journey.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">Premium Due Diligence</span>
                        <p className="text-gray-400 text-sm mt-1">Enhanced verification and assessment processes for business purchases.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">Pro Community Access</span>
                        <p className="text-gray-400 text-sm mt-1">Join exclusive networking events and connect with other AI entrepreneurs.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Fee Savings</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">Premium Listing Placement</span>
                        <p className="text-gray-400 text-sm mt-1">Your listings get featured placement for maximum visibility to potential buyers.</p>
                      </div>
                    </li>
                    
                    
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">Priority Support</span>
                        <p className="text-gray-400 text-sm mt-1">Get faster response times and dedicated support channels.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="p-3 rounded-full bg-[#D946EE]/20 mb-4">
                  <Tag className="h-7 w-7 text-[#D946EE]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Free Listings</h3>
                <p className="text-white/80 text-center">Early adopters can list their AI SaaS products for free, for life! No hidden fees or future charges.</p>
              </div>
              
              <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="p-3 rounded-full bg-[#8B5CF6]/20 mb-4">
                  <PercentIcon className="h-7 w-7 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Commission Structure</h3>
                <p className="text-white/80 text-center">Our tiered commission structure rewards higher value sales with lower rates.</p>
              </div>
              
              <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="p-3 rounded-full bg-[#0EA4E9]/20 mb-4">
                  <User className="h-7 w-7 text-[#0EA4E9]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Buyer Memberships</h3>
                <p className="text-white/80 text-center">Access to our marketplace requires a membership, ensuring only qualified buyers see your listings.</p>
              </div>
            </div>
            
            

            {/* New section for buyer membership details */}
            
          </Card>
        </motion.div>
        
        <motion.div className="container mx-auto px-4 text-center mt-20 max-w-3xl" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.6,
        duration: 0.8
      }}>
          <div className="p-8 rounded-xl bg-[#0EA4E9]/10 backdrop-blur-sm border border-[#0EA4E9]/20">
            <h2 className="text-2xl font-semibold text-white mb-4 exo-2-heading">Ready to List Your AI SaaS Business?</h2>
            <p className="text-white/80 mb-6">Join our community powered marketplace today and connect with qualified buyers looking for innovative AI businesses like yours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/list-product" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                List Your Product
              </a>
              <a href="#" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Pro
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </AnimatedGradientBackground>;
};