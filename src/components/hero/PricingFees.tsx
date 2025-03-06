
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, PercentIcon, CheckCircle, Clock } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const PricingFees = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 text-4xl font-bold text-white exo-2-heading"
        >
          Transparent Pricing and Fees
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-xl text-gray-200 mb-14 max-w-3xl mx-auto"
        >
          We believe in complete transparency. Our simple fee structure ensures you know exactly what to expect when buying or selling AI businesses on our platform.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Fee Card 1 - Commission Structure */}
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
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Fee Card 2 */}
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
