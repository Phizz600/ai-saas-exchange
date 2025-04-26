
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ExitIntentDialog } from "@/components/ExitIntentDialog";
import { motion } from "framer-motion";
import ReviewSection from "@/components/hero/ReviewSection";
import PricingFees from "@/components/hero/PricingFees";
import WhyChooseUs from "@/components/hero/WhyChooseUs";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import EnhancedNdaPolicy from "@/components/hero/EnhancedNdaPolicy";
import { Link } from "react-router-dom";
import { DraftTable } from "lucide-react"; // Added a suitable icon for the admin panel

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
        <ExitIntentDialog />
        
        {/* Admin link - only visible in development */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link 
              to="/admin" 
              className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-4 py-2 rounded-md text-sm hover:from-[#7E59A5] hover:to-[#C935DD] transition-colors flex items-center gap-2 shadow-lg"
            >
              <DraftTable className="h-4 w-4" />
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
