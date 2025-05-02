
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import PricingFees from "@/components/hero/PricingFees";

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
    <div className="min-h-screen bg-gradient-to-b from-[#051223] to-[#092547]">
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
        
        {/* Pro Membership CTA */}
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
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};
