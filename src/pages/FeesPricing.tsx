
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, PercentIcon, CheckCircle, ShieldCheck, Crown, BadgeCheck } from "lucide-react";
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
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="container mx-auto px-4 text-center mb-12 my-[50px]"
        >
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
        
        <motion.div 
          className="container mx-auto px-4 mt-20" 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
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
                        <span className="text-white font-medium">$0 Listing Fees</span>
                        <p className="text-gray-400 text-sm mt-1">List as many AI products as you want without paying the standard listing fee.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">$0 Deposit Fees</span>
                        <p className="text-gray-400 text-sm mt-1">Make offers without paying the 5% platform fee on required deposits.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">Reduced Commission (2% Discount)</span>
                        <p className="text-gray-400 text-sm mt-1">Pay 2% less on our standard commission rates when you sell your AI product.</p>
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
              
              <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Upgrade?</h3>
                    <p className="text-gray-300 max-w-xl">
                      Join our Pro Membership today for just $299/year and start enjoying exclusive benefits and significant savings.
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] min-w-[200px] py-6" size="lg">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center">
                <div className="p-3 rounded-full bg-[#D946EE]/20 mb-4">
                  <DollarSign className="h-7 w-7 text-[#D946EE]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Listing Fee</h3>
                <p className="text-white/80 text-center">A one-time $100 fee applies when listing your AI SaaS product on our marketplace.</p>
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
                  <ShieldCheck className="h-7 w-7 text-[#0EA4E9]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Secure Transactions</h3>
                <p className="text-white/80 text-center">All transactions are processed securely through Escrow.com for buyer and seller protection.</p>
              </div>
            </div>
            
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-white mb-6 exo-2-heading">Commission Rate Breakdown</h2>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader className="bg-white/10">
                    <TableRow>
                      <TableHead className="text-white font-semibold">Final Selling Price</TableHead>
                      <TableHead className="text-white font-semibold">Standard Rate</TableHead>
                      <TableHead className="text-white font-semibold">Pro Member Rate</TableHead>
                      <TableHead className="text-white font-semibold">You Keep (Pro)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$0 - $10,000</TableCell>
                      <TableCell className="text-white/90">10%</TableCell>
                      <TableCell className="text-amber-300 font-medium">8%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">92%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$10,001 - $50,000</TableCell>
                      <TableCell className="text-white/90">8%</TableCell>
                      <TableCell className="text-amber-300 font-medium">6%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">94%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$50,001 - $100,000</TableCell>
                      <TableCell className="text-white/90">6%</TableCell>
                      <TableCell className="text-amber-300 font-medium">4%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">96%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$100,001+</TableCell>
                      <TableCell className="text-white/90">5%</TableCell>
                      <TableCell className="text-amber-300 font-medium">3%</TableCell>
                      <TableCell className="text-[#0EA4E9] font-medium">97%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg mt-6 border border-white/10">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D946EE] mr-3 mt-1 flex-shrink-0" />
                  <p className="text-white/80">
                    <span className="text-white font-medium">Example:</span> If you sell your AI SaaS product for $75,000 as a Pro member, 
                    you'll only pay a 4% commission ($3,000) instead of 6% ($4,500), saving you $1,500!
                  </p>
                </div>
              </div>
            </div>

            {/* New section for bidding and deposit fees */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-white mb-6 exo-2-heading">Bidding & Deposit Fee Structure</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Initial Offer Deposits</h3>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2 mt-1 flex-shrink-0" />
                      <span>10% deposit required when making an offer</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2 mt-1 flex-shrink-0" />
                      <span>5% platform fee applied to deposits (0.5% of offer value)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2 mt-1 flex-shrink-0" />
                      <span>Fully refundable if offer is declined</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2 mt-1 flex-shrink-0" />
                      <span>Applied toward final purchase if offer is accepted</span>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-amber-300">Pro members: No platform fee on deposits</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Updated Offer Deposits</h3>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                      <span>No additional deposit for small increases (less than 20%)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                      <span>For offers increased by more than 20%, only the additional deposit amount is required</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                      <span>5% platform fee applies only to the additional deposit amount</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2 mt-1 flex-shrink-0" />
                      <span>Original deposit is carried forward and applied to the new offer</span>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-5 w-5 text-amber-400 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-amber-300">Pro members: No platform fee on additional deposits</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Deposit Examples</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Initial Offer:</h4>
                    <p className="text-white/80 mb-1">• Offer amount: $50,000</p>
                    <p className="text-white/80 mb-1">• Required deposit: $5,000 (10%)</p>
                    <p className="text-white/80 mb-1">• Platform fee: $250 (5% of deposit)</p>
                    <p className="text-white/80 mb-1">• Total payment: $5,250</p>
                    <p className="text-white/80 mb-1 text-amber-300">• Pro member total: $5,000 (no platform fee)</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Small Increase (less than 20%):</h4>
                    <p className="text-white/80 mb-1">• Updated offer: $55,000 (10% increase)</p>
                    <p className="text-white/80 mb-1">• Additional deposit required: $0</p>
                    <p className="text-white/80 mb-1">• Original deposit is applied to the new offer</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Large Increase (more than 20%):</h4>
                    <p className="text-white/80 mb-1">• Updated offer: $70,000 (40% increase)</p>
                    <p className="text-white/80 mb-1">• New total deposit needed: $7,000 (10% of new offer)</p>
                    <p className="text-white/80 mb-1">• Additional deposit required: $2,000 ($7,000 - $5,000)</p>
                    <p className="text-white/80 mb-1">• Platform fee on additional deposit: $100 (5% of $2,000)</p>
                    <p className="text-white/80 mb-1">• Total additional payment: $2,100</p>
                    <p className="text-white/80 mb-1 text-amber-300">• Pro member total: $2,000 (no platform fee)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div 
          className="container mx-auto px-4 text-center mt-20 max-w-3xl" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
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
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Pro
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </AnimatedGradientBackground>
  );
};
