import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const SidebarUserProfile = () => {
  const session = useSession();
  const user = session?.user;

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
        <Avatar className="h-10 w-10 bg-white">
          <AvatarImage src="/lovable-uploads/db546c52-d93f-41d7-8bf4-a0dfd0b5c3b7.png" />
          <AvatarFallback className="bg-white">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </span>
          <span className="text-xs text-gray-300">{user?.email}</span>
        </div>
      </div>
      <button 
        onClick={handleSignOut} 
        className="text-gray-300 hover:text-white transition-colors"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
};