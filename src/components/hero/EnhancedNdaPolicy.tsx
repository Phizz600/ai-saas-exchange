import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const EnhancedNdaPolicy = () => {
  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Enhanced NDA Protection
            </h2>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8">
            Your intellectual property is protected with military-grade security and legally binding NDAs
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-6 rounded-lg border"
            >
              <Lock className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Automatic NDA Enforcement</h3>
              <p className="text-muted-foreground">
                All buyers must sign legally binding NDAs before accessing sensitive business information
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card p-6 rounded-lg border"
            >
              <Shield className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Legal Protection</h3>
              <p className="text-muted-foreground">
                Full legal recourse and documentation for any confidentiality breaches
              </p>
            </motion.div>
          </div>
          
          <Link to="/privacy">
            <Button className="mt-8" size="lg">
              Learn More About Our Security
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
export default EnhancedNdaPolicy;