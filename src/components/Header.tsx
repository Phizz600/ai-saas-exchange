import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50">
      {/* Main Navigation */}
      <div className="bg-accent text-white">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex flex-col items-center mb-1">
                <span className="text-2xl bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-transparent bg-clip-text pb-0">&lt;/&gt;</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-transparent bg-clip-text">
                  AI Exchange Club
                </span>
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
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-12 gap-8 text-sm">
            <Link to="/brokers" className="text-gray-600 hover:text-primary">
              Meet our Brokers
            </Link>
            <Link to="/insights" className="text-gray-600 hover:text-primary">
              Insights
            </Link>
            <Link to="/pitch" className="text-gray-600 hover:text-primary">
              Pitch to Buyers
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary">
              Why AI Exchange
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-primary">
              Blog
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary">
              Pricing
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-primary">
              Services
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-primary">
              Resources
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-primary">
              Events
            </Link>
          </nav>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="h-12 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Register as a buyer. It's free!
            </span>
            <div className="flex gap-4">
              <Button variant="outline" className="h-8">
                Get a Free Valuation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};