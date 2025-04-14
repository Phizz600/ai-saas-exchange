
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertTriangle, Shield } from "lucide-react";

export const Terms = () => {
  return <AnimatedGradientBackground>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="max-w-5xl mx-auto glass rounded-xl p-8 shadow-xl backdrop-blur-lg bg-white/10 border border-white/20"
        >
          <h1 className="exo-2-heading text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-8 text-center">
            Terms & Conditions
          </h1>
          
          <div className="space-y-8 text-white/80">
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
                <FileText className="h-6 w-6 text-[#D946EE]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Agreement to Terms</h2>
              </div>
              <p>By accessing or using AI Exchange Club, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.</p>
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
                <CheckCircle className="h-6 w-6 text-[#8B5CF6]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Account Responsibilities</h2>
              </div>
              <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
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
                <AlertTriangle className="h-6 w-6 text-[#0EA4E9]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Limitation of Liability</h2>
              </div>
              <p>AI Exchange Club shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the service.</p>
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
                <Shield className="h-6 w-6 text-[#D946EE]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Governing Law</h2>
              </div>
              <p>These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.</p>
            </motion.section>
          </div>
          
          <motion.div className="mt-12 p-6 glass rounded-lg" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.5
        }}>
            <p className="text-white/70 text-center">
              By using our services, you acknowledge that you have read and understood these Terms & Conditions and agree to be bound by them.
            </p>
            <div className="flex justify-center mt-6">
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="px-6 py-2 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white font-medium rounded-md hover:opacity-90 transition-opacity">
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </AnimatedGradientBackground>;
};
