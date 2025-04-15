import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, FileText, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export const ResolutionCenter = () => {
  return <AnimatedGradientBackground>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-5xl mx-auto glass rounded-xl p-8 shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 my-[70px] py-[14px]">
          <h1 className="exo-2-heading text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-8 text-center">
            Resolution Center
          </h1>
          
          <p className="text-white/80 text-center mb-10">
            We're committed to providing fair and transparent solutions for all parties involved.
            Our team is here to help resolve any issues you encounter on our platform.
          </p>

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
                <HelpCircle className="h-6 w-6 text-[#D946EE]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Dispute Resolution</h2>
              </div>
              <p>
                Having a dispute with another user? Submit your case and our mediation team will help 
                find a fair resolution for all parties involved.
              </p>
              <Button className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90">
                Submit a Dispute
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
                <MessageCircle className="h-6 w-6 text-[#8B5CF6]" />
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Mediation Services</h2>
              </div>
              <p>
                Need a neutral third party? Our certified mediators can help facilitate productive 
                conversations to reach mutually acceptable solutions.
              </p>
              <Button className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90">
                Request Mediation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
                <h2 className="text-2xl font-semibold text-white exo-2-heading">File a Complaint</h2>
              </div>
              <p>
                Encountered a serious issue with another user or a transaction? File a formal complaint and 
                our team will investigate the matter thoroughly.
              </p>
              <Button className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90">
                File a Complaint
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
                <h2 className="text-2xl font-semibold text-white exo-2-heading">Safety Center</h2>
              </div>
              <p>
                Learn about our policies to protect users, how we handle sensitive information, and 
                steps we take to ensure a safe marketplace experience.
              </p>
              <Button className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90">
                Visit Safety Center
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
            <h2 className="text-xl font-semibold mb-4 text-white exo-2-heading text-center">Frequently Asked Questions</h2>
            <div className="space-y-6 text-white/80">
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-lg text-white">How long does the resolution process take?</h3>
                <p className="mt-2">Most cases are resolved within 5-7 business days, though complex issues may take longer.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-lg text-white">Is the resolution service free?</h3>
                <p className="mt-2">Basic resolution services are free. Premium mediation services may incur a fee that will be disclosed upfront.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-lg text-white">What information should I provide when filing a dispute?</h3>
                <p className="mt-2">Include all relevant details such as transaction IDs, communication history, and a clear description of the issue.</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="mt-12 text-center" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.6
        }}>
            <h2 className="text-xl font-semibold mb-4 text-white exo-2-heading">Need immediate assistance?</h2>
            <p className="text-white/70 mb-6">Our support team is available to help you resolve any urgent issues</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white">
                Live Chat
              </Button>
              <Button className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90">
                Contact Support
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </AnimatedGradientBackground>;
};
export default ResolutionCenter;