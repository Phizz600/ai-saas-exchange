
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { motion } from "framer-motion";

export const About = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-16 pt-32">
          <div className="max-w-6xl mx-auto backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-xl p-8 md:p-12">
            <h1 className="exo-2-heading text-4xl font-bold text-center mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              About AI Exchange Club
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 text-white"
              >
                <p className="text-lg">
                  AI Exchange Club is the premier marketplace for buying and selling AI-powered SaaS businesses. 
                  We connect innovative AI entrepreneurs with forward-thinking investors, creating opportunities 
                  for both sellers to realize the value of their creation and buyers to acquire cutting-edge 
                  AI technology businesses.
                </p>
                
                <p className="text-lg">
                  Our platform provides a secure, transparent, and efficient marketplace where:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sellers can showcase their AI businesses to qualified buyers</li>
                  <li>Buyers can discover vetted AI businesses with proven potential</li>
                  <li>Both parties benefit from our streamlined valuation and transaction process</li>
                  <li>Expert support ensures smooth and secure transactions</li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 text-white"
              >
                <div className="backdrop-blur-md bg-white/5 rounded-lg border border-white/10 p-6 shadow-lg h-full">
                  <h2 className="exo-2-heading text-2xl font-semibold mb-4 bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">
                    Our Mission
                  </h2>
                  
                  <p className="mb-4">
                    Our mission is to create the most trusted marketplace for AI business transactions, 
                    where innovation is valued fairly and transferred securely.
                  </p>
                  
                  <h2 className="exo-2-heading text-2xl font-semibold mb-4 bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">
                    Why Choose Us
                  </h2>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Specialized focus on AI businesses</li>
                    <li>Thorough vetting and verification processes</li>
                    <li>Secure escrow and transaction services</li>
                    <li>Expert valuation assistance</li>
                    <li>Post-transaction support and resources</li>
                  </ul>
                  
                  <p className="mt-4">
                    Whether you're looking to sell your AI business or invest in the future of technology, 
                    AI Exchange Club provides the platform, tools, and expertise you need to succeed.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <a 
                href="/contact" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Connect With Our Team
              </a>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default About;
