import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSheet } from "@/components/marketplace/notifications/NotificationSheet";
import { useNotifications } from "@/components/marketplace/notifications/useNotifications";
import { ExpandableTabs } from "@/components/header/ExpandableTabs";
import { Home, Store, Package, List, Bell, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
      return data;
    },
  });

  const tabs = [
    { title: "Home", icon: Home },
    { title: "Marketplace", icon: Store },
    { title: "Products", icon: Package },
    { type: "separator" as const },
    { title: "My Listings", icon: List },
    { title: "Notifications", icon: Bell },
    { type: "separator" as const },
    { title: "My Profile", icon: User },
    { title: "Settings", icon: Settings },
    { title: "Log Out", icon: LogOut },
  ];

  const handleTabChange = (index: number | null) => {
    if (index === null) return;
    const tab = tabs[index];
    if ('type' in tab) return;
    
    switch (tab.title) {
      case "Home":
        navigate("/");
        break;
      case "Marketplace":
        navigate("/marketplace");
        break;
      case "Products":
        navigate("/product-dashboard");
        break;
      case "My Listings":
        navigate("/product-dashboard");
        break;
      case "Notifications":
        setIsNotificationSheetOpen(true);
        break;
      case "My Profile":
        navigate("/profile");
        break;
      case "Settings":
        navigate("/settings");
        break;
      case "Log Out":
        supabase.auth.signOut().then(() => {
          navigate('/auth');
        });
        break;
    }
  };

  return (
    <header className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png"
            alt="AI Exchange"
            className="h-16 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4">
          {session && (
            <ExpandableTabs 
              tabs={tabs} 
              onChange={handleTabChange}
              activeColor="text-primary"
              className="hidden md:flex"
            />
          )}
          {session ? (
            <NotificationSheet 
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              open={isNotificationSheetOpen}
              onOpenChange={setIsNotificationSheetOpen}
            />
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
}