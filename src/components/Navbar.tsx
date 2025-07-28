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
import { useAuth } from "@/contexts/AuthContext";
export const Navbar = () => {
  const {
    user,
    signOut
  } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const isProfilePage = location.pathname === '/profile';
  const isHomePage = location.pathname === '/';
  const isPolicyPage = location.pathname === '/policies' || location.pathname === '/terms' || location.pathname === '/nda-policy' || location.pathname === '/fees-pricing';

  // Subscribe to new messages to update unread count
  useEffect(() => {
    if (!user) return;
    const fetchUnreadCount = async () => {
      const count = await getUnreadMessagesCount();
      setUnreadCount(count);
    };
    fetchUnreadCount();
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
  }, [user]);
  const handleNavigationClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!user) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth", {
        state: {
          redirectTo: path,
          message: 'Please sign in to access this feature'
        }
      });
    } else {
      console.log(`User authenticated, proceeding to ${path}`);
      navigate(path);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const navigationItems = [{
    title: "Marketplace",
    href: "/marketplace",
    requiresAuth: true
  }, {
    title: "Claim Free Valuation",
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
  return <nav className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/f1d82e78-2a24-4c2b-b93c-d1a196c1065b.png" alt="AI Exchange Club" className="h-14 w-auto" />
              
          </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {navigationItems.map(item => item.requiresAuth ? <button key={item.href} onClick={e => handleNavigationClick(e, item.href)} className="text-gray-700 hover:text-[#8B5CF6] transition-colors font-medium">
                    {item.title}
                  </button> : <Link key={item.href} to={item.href} className="text-gray-700 hover:text-[#8B5CF6] transition-colors font-medium">
                    {item.title}
                  </Link>)}
            </div>


            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? <>
                  {/* Messages */}
                <Link to="/messages" className="relative">
                    <Button variant="ghost" size="sm" className="relative">
                    <FileText className="h-5 w-5" />
                      {unreadCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>}
                    </Button>
                  </Link>

                  {/* Profile Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                      <DropdownMenuItem className="text-gray-700 hover:text-[#8B5CF6] hover:bg-gray-50">
                        <Link to="/profile" className="w-full py-2 px-3">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 hover:text-[#8B5CF6] hover:bg-gray-50">
                        <Link to="/product-dashboard" className="w-full py-2 px-3">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 hover:text-[#8B5CF6] hover:bg-gray-50">
                        <Link to="/settings" className="w-full py-2 px-3">
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="text-gray-700 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </> : <>
                  <Button variant="ghost" onClick={() => navigate("/auth")} className="text-gray-700 hover:text-[#8B5CF6]">
                    Sign In
                  </Button>
                  <Button onClick={e => handleNavigationClick(e, "/list-product")} className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-purple-500/30">
                    <UserPlus className="mr-2 h-4 w-4" />
                    List Your Product
                </Button>
                </>}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="font-bold text-lg">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <div className="flex items-center space-x-2">
                    <img src="/lovable-uploads/f1d82e78-2a24-4c2b-b93c-d1a196c1065b.png" alt="AI Exchange Club" className="h-8 w-auto" />
                    <span className="text-xl font-bold bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] bg-clip-text text-transparent">
                      AI Exchange
                    </span>
                  </div>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {/* Navigation Items */}
                  {navigationItems.map(item => item.requiresAuth ? <button key={item.href} onClick={e => handleNavigationClick(e, item.href)} className="block text-gray-700 hover:text-[#8B5CF6] transition-colors font-medium w-full text-left">
                        {item.title}
                      </button> : <Link key={item.href} to={item.href} className="block text-gray-700 hover:text-[#8B5CF6] transition-colors font-medium">
                        {item.title}
                      </Link>)}
                  
                  {/* Policy Pages */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Legal</h3>
                    {policyPages.map(page => <Link key={page.href} to={page.href} className="block text-gray-700 hover:text-[#8B5CF6] transition-colors text-sm py-1">
                        {page.title}
                      </Link>)}
                  </div>
                  
                  {/* Auth Section */}
                  <div className="border-t pt-4">
                    {user ? <div className="space-y-2">
                        <Link to="/messages" className="flex items-center justify-between text-gray-700 hover:text-[#8B5CF6] transition-colors">
                          <span>Messages</span>
                          {unreadCount > 0 && <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>}
                        </Link>
                        <Link to="/profile" className="block text-gray-700 hover:text-[#8B5CF6] transition-colors">
                          Profile
                        </Link>
                        <Link to="/product-dashboard" className="block text-gray-700 hover:text-[#8B5CF6] transition-colors">
                          Dashboard
                        </Link>
                        <Link to="/settings" className="block text-gray-700 hover:text-[#8B5CF6] transition-colors">
                          Settings
                        </Link>
                        <button onClick={handleSignOut} className="flex items-center text-gray-700 hover:text-red-600 transition-colors w-full">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </button>
                </div> : <div className="space-y-2">
                        <Button variant="ghost" onClick={() => navigate("/auth")} className="w-full justify-start text-gray-700 hover:text-[#8B5CF6]">
                          Sign In
                        </Button>
                        <Button onClick={e => handleNavigationClick(e, "/list-product")} className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white">
                          <UserPlus className="mr-2 h-4 w-4" />
                          List Your Product
                    </Button>
                      </div>}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>;
};