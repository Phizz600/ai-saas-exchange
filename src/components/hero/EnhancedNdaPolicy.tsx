
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EnhancedNdaPolicy = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
      {/* Wave divider at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
        <svg className="relative block w-full h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-gray-100/80"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-purple-100 relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            {/* Gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 via-[#D946EE]/5 to-[#0EA4E9]/5 pointer-events-none"></div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EE]/10 rounded-full blur-xl"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-r from-[#D946EE]/10 to-[#0EA4E9]/10 rounded-full blur-xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#0EA4E9] rounded-full opacity-20 blur-xl"></div>
                  <div className="bg-white p-6 rounded-full shadow-lg relative z-10">
                    <Shield className="w-16 h-16 text-[#8B5CF6] mx-auto" />
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4 exo-2-heading text-center md:text-left bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">Enhanced NDA Policy</h2>
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
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] text-white hover:shadow-lg group transition-all duration-300"
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

      {/* Wave divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg className="relative block w-full h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-[#f8fafc]"></path>
        </svg>
      </div>
    </section>
  );
};

export default EnhancedNdaPolicy;
