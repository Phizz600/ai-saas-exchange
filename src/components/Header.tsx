import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

export const Header = () => {
  return (
    <header className="w-full z-50">
      {/* Main Navigation */}
      <div className="bg-accent/80 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/47eac7ab-ce1a-4bb8-800b-19f2bfcdd765.png" 
                  alt="AI Exchange Club Logo" 
                  className="h-6 w-auto"
                />
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-white/90">
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:text-white/90">
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:text-white/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-10 gap-8 text-sm">
            <Link to="/why-ai-exchange" className="text-gray-600 hover:text-primary">
              Why AI Exchange
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-primary">
              Blog
            </Link>
            <Link to="/fees" className="text-gray-600 hover:text-primary">
              Fees
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-primary">
              Services
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-primary">
              Resources
            </Link>
          </nav>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="h-10 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Register as a buyer. It's free!
            </span>
            <div className="flex gap-4">
              <Button variant="outline" className="h-7">
                Get a Free Valuation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};