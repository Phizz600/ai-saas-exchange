import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-accent/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-white">
          AISaaS Market
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/marketplace">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Marketplace
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Pricing
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};