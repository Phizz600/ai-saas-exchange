
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, PercentIcon, CheckCircle, Clock, ShieldCheck, Crown, BadgeCheck, Users, Award } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PricingFees = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Pro Membership Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-r from-[#8B5CF6]/30 via-[#D946EE]/40 to-[#0EA4E9]/30 backdrop-blur-sm border border-[#8B5CF6]/50 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 bg-[#D946EE] text-white text-xs font-bold px-4 py-1 rounded-bl transform rotate-0">
              NEW
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <Crown className="h-7 w-7 text-amber-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white exo-2-title">Pro Membership</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Unlock premium benefits and save on fees with our annual Pro Membership plan. Perfect for serious sellers and investors looking to maximize their marketplace experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3">For Sellers</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">$0 listing fees</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Reduced commission rates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">3 code audits per year</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Featured placement</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3">For Buyers</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">$0 deposit fees</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Dedicated account manager</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Enhanced due diligence</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Early access to new listings</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center bg-white/10 rounded-xl p-6 border border-white/10">
                <span className="text-gray-400 text-sm line-through mb-1">$499/year</span>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-white">$299</span>
                  <span className="text-gray-300">/year</span>
                </div>
                <div className="bg-white/10 p-3 rounded-md mb-4 w-full">
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
                    <Award className="h-4 w-4" />
                    <p className="text-sm font-medium">Introductory Pricing</p>
                  </div>
                  <p className="text-gray-300 text-xs text-center">
                    Lock in this annual rate before prices increase!
                  </p>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Card 1 - Commission Structure */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#D946EE]/20 p-4 rounded-full">
                    <PercentIcon className="h-8 w-8 text-[#D946EE]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Commission</h3>
                
                <div className="my-4 bg-white/5 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/10">
                      <TableRow>
                        <TableHead className="text-white text-sm font-medium text-left">Price Range</TableHead>
                        <TableHead className="text-white text-sm font-medium">Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-b border-white/5">
                        <TableCell className="text-gray-300 text-sm py-2 text-left">$0 - $10,000</TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">10%</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-white/5">
                        <TableCell className="text-gray-300 text-sm py-2 text-left">$10,001 - $50,000</TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">8%</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-white/5">
                        <TableCell className="text-gray-300 text-sm py-2 text-left">$50,001 - $100,000</TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">6%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-gray-300 text-sm py-2 text-left">$100,001+</TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">5%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  Pay less as you sell more with our transparent tiered pricing structure.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#D946EE] mr-2" />
                    <span>Lower rates for higher-value deals</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#D946EE] mr-2" />
                    <span>No hidden fees or surprises</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">Pro members: 2% discount</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Card 2 - Listing Fee */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#8B5CF6]/20 p-4 rounded-full">
                    <DollarSign className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Listing Fee</h3>
                
                <div className="relative mb-6">
                  <p className="text-center text-3xl font-bold text-white">$10</p>
                  <div className="absolute -top-3 -right-2 bg-[#0EA4E9] text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                    90% OFF
                  </div>
                  <p className="text-center text-gray-400 line-through">$100</p>
                </div>
                
                <div className="bg-white/5 p-3 rounded-md mb-6">
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-2">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm font-medium">Limited Time Offer</p>
                  </div>
                  <p className="text-gray-300 text-sm text-center">
                    Early adopter pricing! Lock in this rate <span className="font-bold">for life</span> before prices return to normal.
                  </p>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  One-time fee that gives your AI business premium visibility to our network of qualified buyers.
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2" />
                    <span>Professional listing page</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2" />
                    <span>Exposure to qualified buyers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6] mr-2" />
                    <span>Lifetime pricing guarantee</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">Pro members: $0 listing fee</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Card 3 - Deposit Fees */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#0EA4E9]/20 p-4 rounded-full">
                    <ShieldCheck className="h-8 w-8 text-[#0EA4E9]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Deposit Fees</h3>
                
                <div className="my-4 bg-white/5 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/10">
                      <TableRow>
                        <TableHead className="text-white text-sm font-medium text-left">Deposit Type</TableHead>
                        <TableHead className="text-white text-sm font-medium">Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-b border-white/5">
                        <TableCell className="text-gray-300 text-sm py-2 text-left">Initial Deposit</TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">5%</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-white/5">
                        <TableCell className="text-gray-300 text-sm py-2 text-left">Small Increases<br /><span className="text-xs">(less than 20%)</span></TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">None</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-gray-300 text-sm py-2 text-left">Large Increases<br /><span className="text-xs">(more than 20%)</span></TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">5% on additional<br />deposit only</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  Our smart deposit system saves you money when updating your offers.
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2" />
                    <span>Requires 10% deposit on offers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2" />
                    <span>No fees for small offer updates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2" />
                    <span>Fully refundable if offer declined</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">Pro members: $0 deposit fees</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 max-w-2xl mx-auto">
            All transactions are processed securely through Escrow.com to ensure safe and transparent dealings for both parties.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingFees;
