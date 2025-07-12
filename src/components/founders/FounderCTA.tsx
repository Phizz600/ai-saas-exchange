
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FounderCTA = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-[#D946EE]/10 via-[#8B5CF6]/10 to-[#0EA4E9]/10 rounded-2xl p-12">
          <span className="text-3xl mb-6 block">⚡</span>
          <h2 className="exo-2-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to List?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            It's free, fast, and founder-friendly.<br />
            List your AI SaaS business in under 10 minutes and get in front of serious buyers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/list-product">
              <Button size="xl" className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-semibold px-8 py-4 text-lg">
                Start Listing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="text-sm text-gray-600">
              Still building?{" "}
              <a 
                href="https://aiexchangeclub.beehiiv.com/subscribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8B5CF6] hover:underline font-medium"
              >
                Join the Club
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
