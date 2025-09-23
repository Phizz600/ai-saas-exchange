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
import { CookieConsent } from "@/components/CookieConsent";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
export const Index = () => {
  return <div className="min-h-screen relative overflow-hidden">
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
        
        {/* Cookie Consent Notice */}
        <CookieConsent />
        
        {/* Floating Marketplace Button - Removed for controlled access */}
        
        {/* Development links - only visible in development */}
        {import.meta.env.DEV && <div className="fixed bottom-4 left-4 z-50 space-y-2">
            <Link to="/admin" className="block bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
              Admin Panel
            </Link>
          </div>}
      </div>
    </div>;
};
export default Index;