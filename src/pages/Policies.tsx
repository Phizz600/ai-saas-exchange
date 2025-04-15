
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, FileText, HelpCircle } from "lucide-react";

export const Policies = () => {
  return <AnimatedGradientBackground>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-8">  {/* Reduced top margin */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="max-w-5xl mx-auto glass rounded-xl p-8 shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 py-[70px]"
        >
          <div className="text-center mb-12">
            <h1 className="exo-2-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-4">
              Platform Policies
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Understanding our commitment to transparency and user protection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/80">
            <motion.section className="space-y-4 p-6 glass rounded-lg" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-[#D946EE]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Refund Policy</h2>
              </div>
              <p>No refunds are provided for monthly memberships. Listing fee refunds may be considered under certain circumstances on a case-by-case basis.</p>
            </motion.section>

            <motion.section className="space-y-4 p-6 glass rounded-lg" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-[#8B5CF6]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Auction Policy</h2>
              </div>
              <p>All auctions are final. The highest bidder at the end of the auction period is obligated to complete the purchase at the winning bid price.</p>
            </motion.section>

            <motion.section className="space-y-4 p-6 glass rounded-lg" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-[#0EA4E9]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Verification Policy</h2>
              </div>
              <p>All sellers must undergo a verification process to ensure the authenticity of their listings and protect buyers' interests.</p>
            </motion.section>

            <motion.section className="space-y-4 p-6 glass rounded-lg" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }}>
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="h-6 w-6 text-[#D946EE]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Privacy Policy</h2>
              </div>
              <p>We are committed to protecting your privacy and handling your data with the utmost care. All personal information is encrypted and securely stored.</p>
            </motion.section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </AnimatedGradientBackground>;
};
