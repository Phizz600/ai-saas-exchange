import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-accent shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col items-center">
            <span className="text-purple-400 text-2xl mb-1">&lt;/&gt;</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#b975f5] via-[#8b5cf6] to-[#3b82f6] text-transparent bg-clip-text">
              AI Exchange Club
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link to="/auth">
              <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};