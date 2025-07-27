import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const EnhancedNdaPolicy = () => {
  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Secure & Confidential</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Your business information is protected by our comprehensive NDA policy. 
            We ensure complete confidentiality throughout the entire process.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Lock className="h-6 w-6 text-primary" />
            <span className="text-muted-foreground">End-to-end encryption</span>
            <div className="h-4 w-px bg-border" />
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-muted-foreground">Legal protection</span>
          </div>
          
          <div className="mt-8">
            <Link to="/nda-policy">
              <Button variant="outline" className="group">
                Read Full NDA Policy
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default EnhancedNdaPolicy;