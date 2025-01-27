import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ExpandableTabs } from "./header/ExpandableTabs";
import { ProfileMenu } from "./header/ProfileMenu";
import { Home, Store, LayoutDashboard, Bell, Settings, HelpCircle, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Tab {
  title: string;
  icon: any;
  description?: string;
  path?: string;
  onClick?: () => void;
}

interface Separator {
  type: "separator";
}

type TabItem = Tab | Separator;

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMarketplace = location.pathname === '/marketplace';

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out of your account",
        variant: "destructive",
      });
    }
  };

  const navigationTabs: TabItem[] = [
    {
      title: "Home",
      icon: Home,
      description: "Go to homepage",
      path: "/"
    },
    {
      type: "separator"
    },
    {
      title: "Marketplace",
      icon: Store,
      description: "Browse AI products",
      path: "/marketplace"
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "View your dashboard",
      path: "/product-dashboard"
    },
    {
      type: "separator"
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "View notifications",
      path: "/notifications"
    },
    {
      title: "Settings",
      icon: Settings,
      description: "Manage settings",
      path: "/settings"
    },
    {
      title: "Help",
      icon: HelpCircle,
      description: "Get help",
      path: "/help"
    },
    {
      type: "separator"
    },
    {
      title: "Profile",
      icon: User,
      description: "View profile",
      path: "/profile"
    },
    {
      title: "Sign Out",
      icon: LogOut,
      description: "Sign out of your account",
      onClick: handleSignOut
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isMarketplace && (
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/410d1e6b-e7e7-499e-a8f7-9bf6bda5e131.png" 
                  alt="AI Exchange Logo" 
                  className="h-10 w-10"
                />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <ExpandableTabs tabs={navigationTabs} />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};