import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Award, Zap, UserCheck, LineChart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
const WhyChooseUs = () => {
  return <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center mb-12">
          <h2 className="exo-2-heading text-3xl md:text-4xl font-bold text-white mb-4">Why Join The AI Exchange Club?</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Join hundreds of founders and investors who trust our platform for AI SaaS business transactions</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} className="text-center">
            <div className="flex justify-center mb-4">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white text-2xl font-bold">
                98%
              </span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Satisfaction Rate</h3>
            <p className="text-gray-300">From both buyers and sellers on completed transactions</p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="text-center">
            <div className="flex justify-center mb-4">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] text-white text-2xl font-bold">
                1.5x
              </span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Higher Valuations</h3>
            <p className="text-gray-300">Average selling price compared to general marketplaces</p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} className="text-center">
            <div className="flex justify-center mb-4">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#0EA4E9] to-[#D946EE] text-white text-2xl font-bold">
                48h
              </span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Average Time to Offer</h3>
            <p className="text-gray-300">Most quality AI SaaS businesses receive offers within 48 hours</p>
          </motion.div>
        </div>

        <Separator className="bg-white/10 mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }} className="space-y-6">
            <h3 className="exo-2-heading text-2xl font-bold text-white mb-4">
              We're Different
            </h3>
            <p className="text-lg text-gray-200">The AI Exchange Club is the first marketplace specifically designed for AI SaaS businesses. We understand the unique challenges and opportunities in this rapidly evolving space.</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-[#D946EE] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Specialized AI Valuation</h4>
                  <p className="text-gray-300">Our proprietary algorithm accurately values AI businesses based on multiple factors specific to the AI industry.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Award className="h-6 w-6 text-[#8B5CF6] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Pre-qualified Buyers</h4>
                  <p className="text-gray-300">Our buyers undergo a verification process ensuring they're serious and have the necessary expertise.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Zap className="h-6 w-6 text-[#0EA4E9] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1 text-center">Fast Transactions</h4>
                  <p className="text-gray-300">Our streamlined process means deals close in days, not months.</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
            <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 p-6 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-white text-xl font-semibold mb-4">What Our Users Say</h3>
                
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-200 italic mb-3">
                      "I sold my AI content generator for 40% more than I was quoted elsewhere. The process was smooth and the team was incredibly helpful."
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] mr-2"></div>
                      <div>
                        <p className="text-white font-medium">Michael T.</p>
                        <p className="text-xs text-gray-400">Founder, AI Writing Assistant</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-200 italic mb-3">
                      "As an investor, I've found the quality of AI businesses here to be significantly higher than general marketplaces. Worth every penny."
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA4E9] mr-2"></div>
                      <div>
                        <p className="text-white font-medium">Sarah K.</p>
                        <p className="text-xs text-gray-400">AI Startup Investor</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <UserCheck className="h-5 w-5 text-[#D946EE] mr-2" />
                  <span className="text-white text-sm">All testimonials verified by our team</span>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#D946EE]/20 to-[#0EA4E9]/20 blur-xl"></div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default WhyChooseUs;