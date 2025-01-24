import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";

export function Header() {
  const session = useSession();

  return (
    <header className="w-full bg-white border-b z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/47eac7ab-ce1a-4bb8-800b-19f2bfcdd765.png" 
              alt="AI Exchange Club" 
              className="h-20 w-auto"
            />
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/marketplace" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Marketplace
            </Link>
            <Link to="/fees" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Fees
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline">
              Get a Free Valuation
            </Button>
            <Button>
              Sell Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}