import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Award, Zap, UserCheck, Users } from "lucide-react";
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
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Join hundreds of founders and investors who trust our curated deal flow platform</p>
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
                200+
              </span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Active Buyers</h3>
            <p className="text-gray-300">In our private buyer network ready to evaluate deals</p>
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
                48h
              </span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Avg. First Contact</h3>
            <p className="text-gray-300">Most quality listings receive buyer interest within 48 hours</p>
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
                95%
              </span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Listing Quality</h3>
            <p className="text-gray-300">Our curation process ensures only verified, high-quality deals</p>
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
            <p className="text-lg text-gray-200">The AI Exchange Club is the first deal flow platform specifically designed for AI SaaS businesses. We focus on quality curation and direct connections, not managing transactions.</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-[#D946EE] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Specialized AI Curation</h4>
                  <p className="text-gray-300">Our team understands AI SaaS businesses and verifies each listing before sharing with buyers.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Award className="h-6 w-6 text-[#8B5CF6] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Pre-qualified Community</h4>
                  <p className="text-gray-300">Our buyers are verified investors with genuine interest and capability to acquire AI businesses.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Zap className="h-6 w-6 text-[#0EA4E9] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Direct Connections</h4>
                  <p className="text-gray-300">We facilitate introductions, then step back to let you negotiate directly.</p>
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
                <h3 className="text-white text-xl font-semibold mb-4">What Our Community Says</h3>
                
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-200 italic mb-3">&quot;The listing process was wayyy smoother than I expected it to be. Answered some questions about my AI Chrome extension and got approved about a day and a half later. &quot;</p>
                    <div className="flex items-center">
                      <div className="relative w-8 h-8 mr-2">
                        
                        <img src="/images/testimonials/michael.jpg" alt="Michael T., AI SaaS Founder testimonial photo" className="w-8 h-8 rounded-full object-cover" loading="lazy" onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }} />
                      </div>
                      <div>
                        <p className="text-white font-medium">Michael T.</p>
                        <p className="text-xs text-gray-400">AI SaaS Founder</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-200 italic mb-3">&quot;This curated deal flow approach is exactly what I needed. No more sifting through low-quality leads flooding my inbox. 🙌</p>
                    <div className="flex items-center">
                        <div className="relative w-8 h-8 mr-2">
                          
                          <img src="/lovable-uploads/63d6bdee-5c90-4062-936a-6919a88af028.png" alt="Sarah K., AI Startup Investor testimonial photo" className="w-8 h-8 rounded-full object-cover" loading="lazy" onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }} />
                        </div>
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