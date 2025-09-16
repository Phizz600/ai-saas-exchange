import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Navbar } from "@/components/Navbar";
import { RealProfileHeader } from "@/components/profile/RealProfileHeader";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";
import { RealProfileBio } from "@/components/profile/RealProfileBio";
import { ActivityOverview } from "@/components/profile/ActivityOverview";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Upload, Edit3, BarChart3, Database as DatabaseIcon, User, TrendingUp } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Mock profile data as fallback with realistic test data
const mockProfile = {
  id: "test-user-123",
  full_name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  bio: "AI developer with 5+ years of experience building machine learning solutions. Passionate about creating innovative products that solve real-world problems.",
  avatar_url: null,
  user_type: "ai_builder" as const,
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-20T15:30:00Z",
  liked_products: [
    "ai-content-generator",
    "smart-analytics-dashboard", 
    "customer-support-bot",
    "ml-prediction-engine",
    "automated-testing-suite",
    "data-visualization-tool",
    "chatbot-platform",
    "recommendation-system",
    "fraud-detection-api",
    "image-recognition-service",
    "natural-language-processor",
    "sentiment-analysis-tool"
  ],
  location: "United States",
  website: "https://johndoe.dev"
};

export const ProfileDynamicTest = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(80);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      if (!user) {
        // No user authenticated, use mock data
        console.log("No user authenticated, using mock data");
        setProfile(mockProfile);
        setIsAuthenticated(false);
        setCompletionProgress(calculateCompletionProgress(mockProfile));
        return;
      }

      // User is authenticated, fetch real data
      console.log("User authenticated, fetching real data");
      setIsAuthenticated(true);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Using mock data instead.",
        });
        // Fallback to mock data
        setProfile(mockProfile);
        setCompletionProgress(calculateCompletionProgress(mockProfile));
        return;
      }

      setProfile(profileData);
      setCompletionProgress(calculateCompletionProgress(profileData));
      
      toast({
        title: "Success",
        description: "Real profile data loaded successfully!",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Using mock data instead.",
      });
      // Fallback to mock data
      setProfile(mockProfile);
      setCompletionProgress(calculateCompletionProgress(mockProfile));
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionProgress = (profile: Profile | typeof mockProfile) => {
    let completed = 0;
    const total = 6;

    if (profile.full_name) completed++;
    if (profile.username) completed++;
    if (profile.bio) completed++;
    if (profile.avatar_url) completed++;
    if (profile.user_type) completed++;
    if (profile.email) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleAvatarUpdate = (url: string | null) => {
    if (profile) {
      setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
      setCompletionProgress(calculateCompletionProgress({ ...profile, avatar_url: url }));
    }
  };

  const handleBioUpdate = (newBio: string) => {
    if (profile) {
      setProfile(prev => prev ? { ...prev, bio: newBio } : null);
      setCompletionProgress(calculateCompletionProgress({ ...profile, bio: newBio }));
    }
  };

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setCompletionProgress(calculateCompletionProgress(updatedProfile));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PromotionalBanner />
        <Navbar />
        <div className="container mx-auto px-3 py-8 mt-20">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <PromotionalBanner />
        <Navbar />
        <div className="container mx-auto px-3 py-8 mt-20">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Profile Not Found</h2>
              <p className="text-muted-foreground mb-4">
                Unable to load profile data.
              </p>
              <Button onClick={fetchProfile} className="bg-black hover:bg-gray-800 text-white">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PromotionalBanner />
      <Navbar />
      <div className="container mx-auto px-3 py-8 mt-20">
        {/* Dynamic Data Header */}
        <Card className="mb-6 bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5 border-[#D946EE]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <DatabaseIcon className="h-6 w-6 text-green-600" />
                  Dynamic Profile Data (Real Supabase Data)
                </>
              ) : (
                <>
                  <User className="h-6 w-6 text-blue-600" />
                  Profile Test (Mock Data - No Login Required)
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Upload className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Profile Picture</h4>
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated ? "Real upload/remove" : "Mock upload/remove"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Edit3 className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">About Me</h4>
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated ? "Real database updates" : "Mock updates"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-semibold">Activity Data</h4>
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated ? "Real dynamic data" : "Mock realistic data"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Data Source: {isAuthenticated ? "Supabase Database" : "Mock Data"}
                </span>
                <Button 
                  onClick={fetchProfile} 
                  variant="outline" 
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white border-black"
                >
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <RealProfileHeader 
              profile={profile} 
              onAvatarUpdate={handleAvatarUpdate}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            {/* Profile Completion */}
            <ProfileCompletion progress={completionProgress} userType={profile.user_type} />
            
            {/* Bio Section */}
            <RealProfileBio 
              bio={profile.bio} 
              userId={profile.id} 
              onBioUpdate={handleBioUpdate}
              isAuthenticated={isAuthenticated}
            />

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
                <AccountSettings 
                  profile={profile} 
                  onProfileUpdate={handleProfileUpdate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
