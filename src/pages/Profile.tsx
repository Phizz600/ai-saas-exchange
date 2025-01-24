import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LikedProducts } from "@/components/profile/LikedProducts";
import { Badge } from "@/components/ui/badge";
import { UserCheck, MailCheck, Phone } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching user session...");
        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!user) {
          console.log("No user found, redirecting to auth...");
          navigate("/auth");
          return;
        }

        console.log("Fetching profile data for user:", user.id);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        if (!profileData) {
          console.log("No profile found for user:", user.id);
          toast({
            variant: "destructive",
            title: "Profile not found",
            description: "Unable to load your profile. Please try again.",
          });
          return;
        }
        
        console.log("Profile data fetched successfully:", profileData);
        setProfile(profileData);
        
        // Calculate profile completion
        let completion = 0;
        if (profileData.full_name) completion += 20;
        if (profileData.avatar_url) completion += 20;
        if (profileData.bio) completion += 20;
        if (profileData.username) completion += 20;
        if (profileData.user_type) completion += 20;
        setCompletionProgress(completion);
        
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-accent">Profile Not Found</h2>
          <Button onClick={() => navigate("/")} variant="secondary">Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/47eac7ab-ce1a-4bb8-800b-19f2bfcdd765.png" 
            alt="AI Exchange Club Logo" 
            className="h-12 w-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <ProfileHeader 
              profile={profile} 
              onAvatarUpdate={(url) => setProfile(prev => prev ? { ...prev, avatar_url: url } : null)}
            />
            {/* Verification Badges */}
            <div className="mt-4 space-y-2">
              <Badge variant="secondary" className="flex items-center gap-2 w-full justify-center py-2">
                <UserCheck className="w-4 h-4" />
                Identity Verified
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 w-full justify-center py-2">
                <MailCheck className="w-4 h-4" />
                Email Verified
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 w-full justify-center py-2">
                <Phone className="w-4 h-4" />
                Phone Verified
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            <ProfileCompletion progress={completionProgress} userType={profile.user_type} />
            <ProfileBio bio={profile.bio} userId={profile.id} />
            <LikedProducts likedProductIds={profile.liked_products || []} />
            <ProfileContent profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};