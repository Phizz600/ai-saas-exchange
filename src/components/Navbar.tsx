import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, FileText, LogOut, Menu, UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { getUnreadMessagesCount } from "@/integrations/supabase/messages";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const isProfilePage = location.pathname === '/profile';
  const isHomePage = location.pathname === '/';
  const isPolicyPage = location.pathname === '/policies' || location.pathname === '/terms' || location.pathname === '/nda-policy' || location.pathname === '/fees-pricing';
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        const count = await getUnreadMessagesCount();
        setUnreadCount(count);
      }
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to new messages to update unread count
  useEffect(() => {
    if (!isAuthenticated) return;
    const channel = supabase.channel('messages_count').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, async () => {
      const count = await getUnreadMessagesCount();
      setUnreadCount(count);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);
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
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out of your account"
      });
    }
  };
  const navigationItems = [{
    title: "Buy an AI Business",
    href: "https://aiexchangeclub.carrd.co/",
    requiresAuth: false
  }, {
    title: "Take The Valuation Quiz",
    href: "https://aiexchange.club/ai-saas-quiz",
    requiresAuth: false
  }, {
    title: "About",
    href: "/about",
    requiresAuth: false
  }, {
    title: "Contact",
    href: "/contact",
    requiresAuth: false
  }];
  const policyPages = [{
    title: "Platform Policies",
    href: "/policies"
  }, {
    title: "Terms & Conditions",
    href: "/terms"
  }, {
    title: "NDA Policy",
    href: "/nda-policy"
  }, {
    title: "Fees & Pricing",
    href: "/fees-pricing"
  }];
  return <nav className="w-full absolute z-10 py-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png" alt="AI Exchange Club" className="h-32 w-auto rounded-none" />
          </Link>

          <div className="flex items-center gap-2">
            

            {!isAuthenticated ? <Link to="/auth">
                
              </Link> : <>
                <Link to="/messages" className="relative">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" size="icon">
                    <FileText className="h-5 w-5" />
                  </Button>
                  {unreadCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>}
                </Link>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" onClick={handleSignOut} size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#EBEFF1] flex flex-col">
                <SheetHeader className="flex justify-center items-center h-16">
                  <div className="w-full flex justify-center">
                    <img alt="AI Exchange Club" src="/lovable-uploads/da2f8a76-47e6-4112-8900-111cd146ace8.png" className="h-16 w-auto" />
                  </div>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8 flex-grow">
                  {navigationItems.map(item => <a key={item.title} href={item.href} target={item.href.startsWith('http') ? "_blank" : undefined} rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined} className="text-black hover:text-black/80 font-exo text-lg px-4 rounded-lg hover:bg-white/10 transition-colors py-0 flex justify-between items-center">
                      <span>{item.title}</span>
                    </a>)}
                </div>
                <div className="mt-auto mb-6">
                  <a href="https://aiexchange.club/ai-saas-quiz" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90" variant="secondary">
                      Free AI SaaS Valuation
                    </Button>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>;
};