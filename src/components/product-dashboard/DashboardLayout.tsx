
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        console.log("DashboardLayout: Fetching profile for user", user.id);
        
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

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

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || 'there';

  return (
    <AnimatedGradientBackground>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <SidebarInset>
            <Header />
            <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 md:py-8 mt-16">
              <div className="flex flex-col space-y-4 md:space-y-8">
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white font-exo">🌊 Hey {firstName} 👋</h1>
                    <p className="text-sm md:text-base text-white/80 mt-1 md:mt-2">Track, manage and analyze your AI products performance.</p>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input 
                        placeholder="Search products..." 
                        className="pl-10 w-full md:w-[250px] bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/60"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AnimatedGradientBackground>
  );
};
