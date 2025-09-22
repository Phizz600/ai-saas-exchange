import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/CleanAuthContext";

export const SidebarUserProfile = () => {
  const { user, profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-purple-500">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {profile?.full_name || user?.email?.split('@')[0]}
          </span>
          <span className="text-xs text-white/60">{user?.email}</span>
        </div>
      </div>
      <button 
        onClick={handleSignOut} 
        className="text-white/60 hover:text-white transition-colors"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
};