import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export const DashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        console.log("DashboardLayout: Fetching profile for user", user.id);
        const {
          data: profileData,
          error
        } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (error) {
          console.error("DashboardLayout: Error fetching profile:", error);
          return;
        }
        console.log("DashboardLayout: Profile fetched successfully:", profileData);
        setProfile(profileData);
      } catch (error) {
        console.error("DashboardLayout: Error in fetchProfile:", error);
      }
    };
    fetchProfile();
  }, []);
  return <AnimatedGradientBackground>
      <div className="min-h-screen w-full">
        <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 md:py-8">
          <div className="flex flex-col space-y-4 md:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </AnimatedGradientBackground>;
};