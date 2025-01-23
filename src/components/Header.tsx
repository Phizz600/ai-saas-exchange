import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";

export function Header() {
  const session = useSession();

  return (
    <header className="w-full bg-white border-b z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b2726e08-98dd-472d-b44a-b780d6e1343e.png" 
              alt="AI Exchange Club" 
              className="h-8"
            />
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/marketplace" className="text-sm font-medium">
              Marketplace
            </Link>
            <Link to="/fees" className="text-sm font-medium">
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
            {!session?.user && (
              <Link to="/auth">
                <Button variant="outline">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}