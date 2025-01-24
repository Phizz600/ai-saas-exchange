import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" 
              alt="AI Exchange Club" 
              className="h-16 w-auto"
            />
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