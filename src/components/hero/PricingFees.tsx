import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, PercentIcon, CheckCircle, Users, BadgeCheck, Crown, User, Tag, ShieldCheck } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
const PricingFees = () => {
  return <section className="py-0">
      <div className="container mx-auto px-4">
        {/* Pro Membership Banner */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }} className="mb-12">
          
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Card 1 - Commission Structure */}
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
                    
                    
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Card 2 - Listing Fee */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }}>
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#8B5CF6]/20 p-4 rounded-full">
                    <Tag className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Listing Fee</h3>
                
                <div className="relative mb-6">
                  <p className="text-center text-3xl font-bold text-white">FREE</p>
                  <div className="absolute -top-3 -right-2 bg-[#0EA4E9] text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                    LIFETIME
                  </div>
                  <p className="text-center text-gray-400 line-through">$100</p>
                </div>
                
                <div className="bg-white/5 p-3 rounded-md mb-6">
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-2">
                    <Users className="h-4 w-4" />
                    <p className="text-sm font-medium">Early Adopter Benefit</p>
                  </div>
                  <p className="text-gray-300 text-sm text-center">
                    Early adopters get <span className="font-bold">lifetime free listings</span> - join now before this offer ends!
                  </p>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  List your AI business with premium visibility to our network of qualified buyers, completely free.
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
                    <span>Lifetime free listings guarantee</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">Pro members: Priority placement</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Card 3 - Buyer Membership Fees (replacing Deposit Fees) */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }}>
            <Card className="h-full p-8 bg-white/10 backdrop-blur-sm border-white/5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#0EA4E9]/20 p-4 rounded-full">
                    <User className="h-8 w-8 text-[#0EA4E9]" />
                  </div>
                </div>
                <h3 className="text-center text-2xl font-bold text-white mb-4">Buyer Membership</h3>
                
                <div className="my-4 bg-white/5 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/10">
                      <TableRow>
                        <TableHead className="text-white text-sm font-medium text-left">Membership Type</TableHead>
                        <TableHead className="text-white text-sm font-medium">Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-b border-white/5">
                        
                        
                      </TableRow>
                      <TableRow className="border-b border-white/5">
                        <TableCell className="text-gray-300 text-sm py-2 text-left">Pro Membership</TableCell>
                        <TableCell className="text-gray-300 text-sm py-2 font-semibold">$7/month</TableCell>
                      </TableRow>
                      <TableRow>
                        
                        
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  Membership required to access the marketplace and make offers on AI businesses.
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2" />
                    <span>Full marketplace access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2" />
                    <span>Make offers on any listing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0EA4E9] mr-2" />
                    <span>Secure escrow transactions</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-amber-300">Pro: Premium due diligence support</span>
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
        delay: 0.5
      }} className="text-center mt-12">
          <p className="text-gray-300 max-w-2xl mx-auto my-[34px]">
            All transactions are processed securely through Escrow.com to ensure safe and transparent dealings for both parties.
          </p>
        </motion.div>
      </div>
    </section>;
};
export default PricingFees;