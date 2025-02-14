
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isProductPage = location.pathname.startsWith('/product/');

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

  const buttonClasses = isMobile 
    ? "text-sm px-3 py-1.5" 
    : "px-4 py-2";

  const logoSize = isMobile ? "h-12" : "h-16";

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 lg:h-24 justify-between items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" 
                alt="AI Exchange Club" 
                className={`${logoSize} w-auto`}
              />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                onClick={handleMarketplaceClick}
                className={`bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white ${buttonClasses}`}
              >
                {isMobile ? "Market" : "Marketplace"}
              </Button>
              {!isAuthenticated && (
                <Link to="/auth">
                  <Button 
                    variant="secondary" 
                    className={`bg-secondary hover:bg-secondary/90 ${buttonClasses}`}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
