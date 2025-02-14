
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === '/profile';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMarketplaceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth");
    } else {
      console.log("User authenticated, proceeding to marketplace");
      navigate("/marketplace");
    }
  };

  return (
    <nav className={`${isProfilePage ? '' : 'fixed'} top-0 left-0 right-0 z-50 backdrop-blur-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" 
              alt="AI Exchange Club" 
              className="h-26 w-auto"
            />
          </Link>
          
          <div className="flex items-center space-x-6">
            <Button 
              onClick={handleMarketplaceClick}
              className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
            >
              Marketplace
            </Button>
            {!isAuthenticated && (
              <Link to="/auth">
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
