import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, Globe2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { LikedProducts } from "@/components/profile/LikedProducts";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(33);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
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
        console.error("Error fetching profile:", error);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <ProfileAvatar
                    avatarUrl={profile.avatar_url}
                    userId={profile.id}
                    onAvatarUpdate={(url) => setProfile(prev => prev ? { ...prev, avatar_url: url } : null)}
                  />
                  <h2 className="text-2xl font-semibold mb-1 mt-4">
                    {profile.full_name || "Anonymous User"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">@{profile.username}</p>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>United States</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe2 className="w-4 h-4 mr-2" />
                      <span>English</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Response time: ~2 hours</span>
                    </div>
                  </div>

                  <div className="w-full mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full mb-3"
                      onClick={() => navigate('/marketplace')}
                    >
                      Preview public profile
                    </Button>
                    {profile.user_type === "ai_builder" && (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => navigate('/marketplace')}
                      >
                        Create New Listing
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={completionProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to increase visibility and trust with potential {profile.user_type === "ai_builder" ? "buyers" : "sellers"}.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {profile.bio || "Tell others about yourself and your expertise..."}
                </p>
              </CardContent>
            </Card>

            {/* Liked Products */}
            <LikedProducts likedProductIds={profile.liked_products || []} />

            {/* Conditional Content */}
            {profile.user_type === "ai_builder" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My AI Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No products listed yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start selling your AI products to reach potential buyers
                    </p>
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => navigate('/marketplace')}
                    >
                      Create Your First Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse the marketplace to find AI products to invest in
                    </p>
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => navigate('/marketplace')}
                    >
                      Explore Marketplace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};