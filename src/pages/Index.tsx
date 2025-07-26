import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import ReviewSection from "@/components/hero/ReviewSection";
import PricingFees from "@/components/hero/PricingFees";
import WhyChooseUs from "@/components/hero/WhyChooseUs";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import EnhancedNdaPolicy from "@/components/hero/EnhancedNdaPolicy";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

export const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        <Hero />
        <WhyChooseUs />
        <PricingFees />
        <EnhancedNdaPolicy />
        <ReviewSection />
        <Footer />
        
        {/* Floating Marketplace Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link to="/marketplace">
            <Button 
              className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full p-4"
              size="lg"
            >
              <Store className="h-6 w-6 mr-2" />
              Marketplace
            </Button>
          </Link>
        </motion.div>
        
        {/* Admin link - only visible in development */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 z-50">
            <Link 
              to="/admin" 
              className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
