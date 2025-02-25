
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out of your account",
        variant: "destructive"
      });
    }
  };

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
      href: "/coming-soon",
      requiresAuth: true
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
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      requiresAuth: true
    }
  ];

  return <nav className={`${isProfilePage ? '' : 'fixed'} top-0 left-0 right-0 z-50 backdrop-blur-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-4">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#EBEFF1]">
                <SheetHeader className="flex justify-center items-center">
                  <img alt="AI Exchange Club" src="/lovable-uploads/da2f8a76-47e6-4112-8900-111cd146ace8.png" className="h-16 w-auto" />
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navigationItems.map(item => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={(e) => item.requiresAuth ? handleNavigationClick(e, item.href) : null}
                      className="text-black hover:text-black/80 font-exo text-lg font-bold py-2 px-4 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Button 
                      onClick={handleSignOut} 
                      variant="secondary" 
                      className="mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90"
                    >
                      Sign Out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" alt="AI Exchange Club" className="h-40 w-auto rounded-none pt-4" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                  Sign In
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" onClick={handleSignOut} className="flex items-center gap-2">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>;
};

