import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          AISaaS Market
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/marketplace">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Marketplace
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};