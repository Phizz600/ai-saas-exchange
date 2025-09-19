import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Navbar } from "@/components/Navbar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ActivityOverview } from "@/components/profile/ActivityOverview";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Database as DatabaseIcon
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const ProfileDemo = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setShowAuthPrompt(true);
      } else if (user) {
        console.log('User authenticated:', user.email);
        setIsAuthenticated(true);
        await fetchProfile(user.id);
      } else {
        console.log('No authenticated user');
        setIsAuthenticated(false);
        setShowAuthPrompt(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setShowAuthPrompt(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
        return;
      }

      if (profileData) {
        setProfile(profileData);
        
        // Calculate profile completion
        let completion = 0;
        if (profileData.full_name) completion += 20;
        if (profileData.avatar_url) completion += 20;
        if (profileData.bio) completion += 20;
        if (profileData.username) completion += 20;
        if (profileData.user_type) completion += 20;
        setCompletionProgress(completion);
      } else {
        // Create a basic profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: 'New User',
            username: 'newuser',
            user_type: 'ai_builder'
          })
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError);
        } else {
          setProfile(newProfile);
          setCompletionProgress(40); // 20 for full_name + 20 for user_type
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleAvatarUpdate = (url: string | null) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
  };

  const handleBioUpdate = (bio: string) => {
    setProfile(prev => prev ? { ...prev, bio } : null);
  };

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (showAuthPrompt) {
    return (
      <div className="min-h-screen bg-white">
        <PromotionalBanner />
        <Navbar />
        <div className="container mx-auto px-3 py-8 mt-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To view your profile with real data, you need to be authenticated.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = '/auth-test-complete'}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Authentication Test
                </Button>
                <Button 
                  onClick={() => window.location.href = '/profile-dynamic-test'}
                  variant="outline"
                  className="w-full"
                >
                  <DatabaseIcon className="h-4 w-4 mr-2" />
                  View Demo with Mock Data
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>For testing:</strong> Use the Complete Authentication Test to sign in with real credentials, 
                or view the demo with mock data to see the profile interface.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-accent">Profile Not Found</h2>
          <Button onClick={() => window.location.href = '/auth-test-complete'} variant="secondary">
            Complete Authentication
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PromotionalBanner />
      <Navbar />
      <div className="container mx-auto px-3 py-8 mt-20">
        {/* Status Banner */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Authenticated Profile Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Authenticated</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {profile.full_name || 'No name'} ({profile.user_type || 'No type'})
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Real data from Supabase database
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <ProfileHeader 
              profile={profile} 
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            {/* Profile Completion */}
            <ProfileCompletion profile={profile} />
            
            {/* Bio Section */}
            <ProfileBio bio={profile.bio} userId={profile.id} />

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
