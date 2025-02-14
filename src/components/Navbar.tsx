
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  const NavItems = () => (
    <>
      <Button 
        onClick={handleMarketplaceClick}
        className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white w-full sm:w-auto"
      >
        Marketplace
      </Button>
      {!isAuthenticated && (
        <Link to="/auth" className="w-full sm:w-auto">
          <Button 
            variant="secondary" 
            className="bg-secondary hover:bg-secondary/90 w-full sm:w-auto"
          >
            Sign In
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className={`${isProfilePage ? '' : 'fixed'} top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" 
              alt="AI Exchange Club" 
              className="h-12 sm:h-16 w-auto"
            />
          </Link>
          
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[80%] sm:max-w-sm">
                <div className="mt-8 flex flex-col gap-4">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center gap-4">
              <NavItems />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
