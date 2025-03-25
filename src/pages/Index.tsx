
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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        <Hero />
        <WhyChooseUs />
        <PricingFees />
        <ReviewSection />
        <Footer />
        <ExitIntentDialog />
        
        {/* Admin link - visible in development or to authenticated users */}
        {(import.meta.env.DEV || isAuthenticated) && (
          <div className="fixed bottom-4 right-4 z-50">
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
