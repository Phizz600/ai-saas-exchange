import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSheet } from "@/components/marketplace/notifications/NotificationSheet";
import { useNotifications } from "@/components/marketplace/notifications/useNotifications";
import { ProfileMenu } from "@/components/header/ProfileMenu";

export function Header() {
  const [profile, setProfile] = useState<{ username?: string; avatar_url?: string; } | null>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/0283f7d5-13a6-40c9-b40a-69868474cec9.png"
                alt="AI Exchange"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {location.pathname !== '/auth' && (
            <div className="flex items-center gap-4">
              <NotificationSheet 
                notifications={notifications} 
                unreadCount={unreadCount} 
                onMarkAsRead={markAsRead}
              />
              <ProfileMenu profile={profile} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}