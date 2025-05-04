
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, PercentIcon, CheckCircle, User, Tag } from "lucide-react";
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
  
  return (
    <AnimatedGradientBackground>
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
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-white mb-6 exo-2-heading">Commission Rate Breakdown</h2>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader className="bg-white/10">
                    <TableRow>
                      <TableHead className="text-white font-semibold">Final Selling Price</TableHead>
                      <TableHead className="text-white font-semibold">Standard Rate</TableHead>
                      <TableHead className="text-white font-semibold">You Keep</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$0 - $10,000</TableCell>
                      <TableCell className="text-white/90">10%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">90%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$10,001 - $50,000</TableCell>
                      <TableCell className="text-white/90">8%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">92%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$50,001 - $100,000</TableCell>
                      <TableCell className="text-white/90">6%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">94%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$100,001+</TableCell>
                      <TableCell className="text-white/90">5%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">95%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg mt-6 border border-white/10">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D946EE] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-white/80">
                    <span className="text-white font-medium">Example:</span> If you sell your AI SaaS product for $75,000, 
                    you'll only pay a 6% commission ($4,500), keeping $70,500 from your sale!
                  </p>
                </div>
              </div>
            </div>

            {/* Membership Details Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-white mb-6 exo-2-heading">Membership Details</h2>
              
              <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Premium Membership ($7/month)</h3>
                <p className="text-gray-300 mb-6">
                  Our marketplace membership gives you exclusive access to AI SaaS investment opportunities 
                  that aren't available anywhere else.
                </p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                    <span>Full marketplace access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                    <span>Make unlimited offers on listings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                    <span>Secure escrow transaction system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                    <span>Premium due diligence support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
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
                <h3 className="text-xl font-semibold text-white mb-3">Membership</h3>
                <p className="text-white/80 text-center">Access to our marketplace requires a membership, ensuring only qualified buyers see your listings.</p>
              </div>
            </div>
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
            <h2 className="text-2xl font-semibold text-white mb-4 exo-2-heading">Ready to List Your AI SaaS Product?</h2>
            <p className="text-white/80 mb-6">
              Join our marketplace today and connect with qualified buyers looking for innovative AI solutions like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/list-product" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                List Your Product
              </a>
              <a href="#" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                Join Membership
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </AnimatedGradientBackground>
  );
};
