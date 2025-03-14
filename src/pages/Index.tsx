
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ExitIntentDialog } from "@/components/ExitIntentDialog";
import { motion } from "framer-motion";
import ReviewSection from "@/components/hero/ReviewSection";
import PricingFees from "@/components/hero/PricingFees";
import WhyChooseUs from "@/components/hero/WhyChooseUs";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";

export const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <WhyChooseUs />
        <PricingFees />
        <ReviewSection />
        <Footer />
        <ExitIntentDialog />
      </div>
    </div>
  );
};

export default Index;
