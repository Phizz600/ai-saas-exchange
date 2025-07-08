
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { NdaFeatures } from "@/components/nda-policy/NdaFeatures";
import { NdaFaq } from "@/components/nda-policy/NdaFaq";
import { NdaCta } from "@/components/nda-policy/NdaCta";
import { motion } from "framer-motion";
import { ConfidentialWatermark } from "@/components/marketplace/product-card/ConfidentialWatermark";
import { Button } from "@/components/ui/button";
import { FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function NdaPolicy() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#13293D]/10 to-[#0EA4E9]/10 backdrop-blur-sm py-12 px-6 rounded-lg mb-8 border border-white/20">
              <div className="absolute inset-0 z-0">
                <ConfidentialWatermark text="CONFIDENTIAL" opacity={0.15} rotation={30} />
              </div>
              
              <div className="relative z-10 text-center">
                <motion.h1 
                  className="exo-2-heading text-4xl font-bold mb-6 bg-gradient-to-r from-[#13293D] to-[#0EA4E9] bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Non-Disclosure Agreement Policy
                </motion.h1>
                
                <motion.p 
                  className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Our NDA policy protects sensitive information when buying or selling AI products. 
                  Learn how we safeguard your intellectual property and business details.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <a href="https://aiexchangeclub.carrd.co/" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-gradient-to-r from-[#13293D] to-[#0EA4E9] hover:opacity-90 text-white px-8 py-3">
                      <Shield className="mr-2 h-5 w-5" />
                      Browse Protected Listings
                    </Button>
                  </a>
                  <Button variant="outline" className="border-[#0EA4E9] text-[#0EA4E9] hover:bg-[#0EA4E9] hover:text-white px-8 py-3" asChild>
                    <Link to="/terms">
                      <FileText className="mr-2 h-5 w-5" />
                      View Terms
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-12">
              <h2 className="exo-2-heading text-3xl font-bold mb-8 text-center text-gray-800">Key Features of Our NDA System</h2>
              <NdaFeatures />
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="exo-2-heading text-3xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h2>
              <NdaFaq />
            </div>

            {/* CTA Section */}
            <NdaCta />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
