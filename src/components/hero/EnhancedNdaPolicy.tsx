import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const EnhancedNdaPolicy = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-[#8B5CF6] mr-4" />
            <h2 className="text-4xl font-bold text-gray-900 exo-2-heading">
              Enhanced NDA Protection
            </h2>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your intellectual property is protected with industry-leading security measures
            and comprehensive non-disclosure agreements for all platform interactions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <Lock className="h-8 w-8 text-[#D946EE] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatic NDAs</h3>
              <p className="text-gray-600">
                Every interaction on our platform is covered by comprehensive NDAs,
                ensuring your ideas remain confidential.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <Shield className="h-8 w-8 text-[#0EA4E9] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Framework</h3>
              <p className="text-gray-600">
                Built-in legal protections with enforceable agreements
                that protect both buyers and sellers.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <ArrowRight className="h-8 w-8 text-[#8B5CF6] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Process</h3>
              <p className="text-gray-600">
                Step-by-step verification and secure document sharing
                throughout the entire transaction process.
              </p>
            </motion.div>
          </div>
          
          <Link to="/nda-policy">
            <Button className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90 transition-all duration-300">
              Learn More About Our NDA Policy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
export default EnhancedNdaPolicy;