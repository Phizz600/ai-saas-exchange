
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ExpandableTabs } from "./header/ExpandableTabs";
import { Store, LayoutDashboard, Bell, HelpCircle, User, LogOut, MessageSquare, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSheet } from "./marketplace/notifications/NotificationSheet";
import { useNotifications } from "./marketplace/notifications/useNotifications";
import { useState, useEffect } from "react";
import { getUnreadMessagesCount } from "@/integrations/supabase/messages";
import { Badge } from "@/components/ui/badge";

interface Tab {
  title: string;
  icon: any;
  description?: string;
  path?: string;
  onClick?: () => void;
  indicator?: boolean;
  badge?: number;
}

interface Separator {
  type: "separator";
}

type TabItem = Tab | Separator;

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const count = await getUnreadMessagesCount();
      setUnreadMessages(count);
    };
    
    loadUnreadCount();
    
    // Subscribe to new messages to update unread count
    const channel = supabase
      .channel('header_messages_count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async () => {
          const count = await getUnreadMessagesCount();
          setUnreadMessages(count);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      title: "Messages",
      icon: MessageSquare,
      description: "View messages",
      path: "/messages",
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      type: "separator"
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "View notifications",
      onClick: () => setNotificationsOpen(true),
      indicator: unreadCount > 0
    },
    {
      title: "Settings",
      icon: Settings,
      description: "Manage your account",
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
      type: "separator"
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
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/410d1e6b-e7e7-499e-a8f7-9bf6bda5e131.png" 
                alt="AI Exchange Logo" 
                className="h-12 w-12"
              />
            </Link>
          </div>
          <div className="flex items-center">
            <ExpandableTabs tabs={navigationTabs} />
          </div>
        </div>
      </div>
      <NotificationSheet
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </header>
  );
};
