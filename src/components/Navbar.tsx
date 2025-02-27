
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === '/profile';

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigationClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth");
    } else {
      console.log(`User authenticated, proceeding to ${path}`);
      navigate(path);
    }
  };

  const navigationItems = [
    {
      title: "Buy an AI Business",
      href: isAuthenticated ? "/coming-soon" : "/auth",
      requiresAuth: false
    },
    {
      title: "AI Business Valuation",
      href: "/listproduct",
      requiresAuth: true
    },
    {
      title: "About",
      href: "/about",
      requiresAuth: false
    }
    // Removed the Dashboard item
  ];

  return (
    <nav className={`${isProfilePage ? '' : 'fixed'} top-0 left-0 right-0 z-50 backdrop-blur-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png"
              alt="AI Exchange Club"
              className="h-28 w-auto rounded-none pt-4"
            />
          </Link>

          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                  Sign In
                </Button>
              </Link>
            ) : null}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white font-extrabold">
                  <Menu className="h-14 w-14 stroke-[3]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#EBEFF1] flex flex-col">
                <SheetHeader className="flex justify-center items-center h-16">
                  <div className="w-full flex justify-center">
                    <img
                      alt="AI Exchange Club"
                      src="/lovable-uploads/da2f8a76-47e6-4112-8900-111cd146ace8.png"
                      className="h-16 w-auto"
                    />
                  </div>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8 flex-grow">
                  {navigationItems.map(item => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={e => item.requiresAuth && !isAuthenticated ? handleNavigationClick(e, item.href) : null}
                      className="text-black hover:text-black/80 font-exo text-lg px-4 rounded-lg hover:bg-white/10 transition-colors py-0"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto mb-6">
                  <Button
                    onClick={e => handleNavigationClick(e, '/list-product')}
                    className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90"
                    variant="secondary"
                  >
                    Sell Your AI SaaS Business
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
