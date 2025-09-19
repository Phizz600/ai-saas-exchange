import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { ActivityOverview } from "@/components/profile/ActivityOverview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, TrendingUp } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export const Profile = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const calculateCompletion = (profileData: Profile) => {
    let completion = 0;
    if (profileData.full_name) completion += 20;
    if (profileData.avatar_url) completion += 20;
    if (profileData.bio) completion += 20;
    if (profileData.username) completion += 20;
    if (profileData.user_type) completion += 20;
    return completion;
  };
  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    const newCompletion = calculateCompletion(updatedProfile);
    setCompletionProgress(newCompletion);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching user session...");
        const {
          data: {
            user
          },
          error: sessionError
        } = await supabase.auth.getUser();
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
        const {
          data: profileData,
          error: profileError
        } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }
        if (!profileData) {
          console.log("No profile found for user:", user.id, "Creating new profile...");

          // Create a new profile for the user
          const {
            data: newProfile,
            error: createError
          } = await supabase.from("profiles").insert({
            id: user.id,
            first_name: user.user_metadata?.first_name || null,
            last_name: user.user_metadata?.last_name || null,
            full_name: user.user_metadata?.full_name || null,
            user_type: user.user_metadata?.user_type || 'ai_investor',
            bio: null,
            avatar_url: null,
            username: null,
            liked_products: [],
            saved_products: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).select().single();
          if (createError) {
            console.error("Error creating profile:", createError);
            toast({
              variant: "destructive",
              title: "Profile Creation Failed",
              description: "Unable to create your profile. Please try again."
            });
            return;
          }
          console.log("Profile created successfully:", newProfile);
          setProfile(newProfile);

          // Calculate profile completion for new profile
          const completion = calculateCompletion(newProfile);
          setCompletionProgress(completion);
          toast({
            title: "Profile Created",
            description: "Your profile has been created successfully."
          });
          return;
        }
        console.log("Profile data fetched successfully:", profileData);
        setProfile(profileData);

        // Calculate profile completion
        const completion = calculateCompletion(profileData);
        setCompletionProgress(completion);
      } catch (error: any) {
        console.error("Error in profile fetch:", error);
        let errorMessage = "Failed to load profile data. Please try again.";
        if (error.message?.includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message?.includes('permission')) {
          errorMessage = "Permission denied. Please sign in again.";
        } else if (error.message?.includes('not found')) {
          errorMessage = "Profile not found. Please contact support.";
        }
        toast({
          variant: "destructive",
          title: "Load Failed",
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, toast]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-accent">Loading Profile...</h2>
          <p className="text-muted-foreground mb-4">Setting up your profile...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-white">
      
      <Navbar />
      <div className="container mx-auto px-3 mt-20 py-[32px] my-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <ProfileHeader profile={profile} onAvatarUpdate={url => {
            const updatedProfile = profile ? {
              ...profile,
              avatar_url: url
            } : null;
            if (updatedProfile) {
              handleProfileUpdate(updatedProfile);
            }
          }} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            {/* Profile Completion */}
            <ProfileCompletion progress={completionProgress} userType={profile.user_type} />
            
            {/* Bio Section */}
            <ProfileBio bio={profile.bio} userId={profile.id} onBioUpdate={newBio => {
            const updatedProfile = {
              ...profile,
              bio: newBio
            };
            handleProfileUpdate(updatedProfile);
          }} />

            {/* Main Tabs */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-6">
                <ActivityOverview profile={profile} />
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <AccountSettings profile={profile} onProfileUpdate={handleProfileUpdate} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>;
};