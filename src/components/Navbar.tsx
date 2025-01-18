import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code } from "lucide-react";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full backdrop-blur-md z-50 border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex flex-col items-center">
          <Code className="w-6 h-6 mb-1 text-[#D946EF]" />
          <span className="font-exo text-xl font-semibold bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
            AI Exchange Club
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/marketplace">
            <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-white/10">
              Marketplace
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-white/10">
              Pricing & Fees
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#D946EF] hover:to-[#8B5CF6] text-white shadow-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};