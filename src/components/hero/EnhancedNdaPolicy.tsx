
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EnhancedNdaPolicy = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#8B5CF6]/10 via-[#D946EE]/10 to-[#0EA4E9]/10 rounded-2xl p-8 md:p-12 shadow-lg border border-purple-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#0EA4E9] rounded-full opacity-20 blur-xl"></div>
                  <div className="bg-white p-6 rounded-full shadow-lg relative z-10">
                    <Shield className="w-16 h-16 text-[#8B5CF6] mx-auto" />
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4 exo-2-heading text-center md:text-left">Enhanced NDA Policy</h2>
                <p className="text-gray-700 mb-6">
                  Our robust NDA system ensures your confidential business information remains protected throughout the 
                  entire selling process. With secure digital signatures, IP tracking, and legal enforceability, you can 
                  confidently share sensitive details with potential buyers.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#D946EE]" />
                    <span className="text-sm font-medium">IP Address Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#8B5CF6]" />
                    <span className="text-sm font-medium">Digital Signatures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#0EA4E9]" />
                    <span className="text-sm font-medium">Legal Enforceability</span>
                  </div>
                </div>
                
                <div className="mt-8 text-center md:text-left">
                  <Link to="/nda-policy">
                    <Button 
                      variant="purple" 
                      className="group"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedNdaPolicy;
