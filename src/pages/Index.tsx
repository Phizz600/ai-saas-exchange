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
import { useEffect } from "react";
import { createTestUser } from "@/utils/testAuth";
export const Index = () => {
  // Test user creation in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🧪 Starting test user creation...');
      createTestUser().then(result => {
        console.log('🧪 Test user creation result:', result);
      }).catch(error => {
        console.error('🧪 Test user creation failed:', error);
      });
    }
  }, []);

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
            <Link to="/profile-edit-demo" className="block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Profile Edit Demo
            </Link>
            <Link to="/profile-design-preview" className="block bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors">
              Profile Design Preview
            </Link>
            <Link to="/profile-test" className="block bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
              Profile Test (No Login)
            </Link>
            <Link to="/profile-dynamic-test" className="block bg-orange-600 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-700 transition-colors">
              Profile Dynamic Test
            </Link>
            <Link to="/profile-real-test" className="block bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
              Profile Real Test (DB)
            </Link>
            <Link to="/auth-debug" className="block bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition-colors">
              Auth Debug
            </Link>
            <Link to="/simple-auth-test" className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors">
              Simple Auth Test
            </Link>
            <Link to="/auth-test-complete" className="block bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition-colors">
              Complete Auth Test
            </Link>
          </div>}
      </div>
    </div>;
};
export default Index;