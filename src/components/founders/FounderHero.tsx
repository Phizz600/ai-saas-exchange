
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FounderHero = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="exo-2-heading text-4xl md:text-6xl font-bold text-white mb-6">
          Sell Your AI SaaS Business
          <br />
          <span className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-transparent bg-clip-text">
            Without the Stress
          </span>
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          The founder-first marketplace built for speed, support, and serious buyers.
        </p>
        
        <Link to="/list-product">
          <Button size="xl" className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-semibold px-8 py-4 text-lg">
            List Your Business
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
