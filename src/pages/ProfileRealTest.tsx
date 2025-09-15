import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Navbar } from "@/components/Navbar";
import { RealProfileHeader } from "@/components/profile/RealProfileHeader";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";
import { RealProfileBio } from "@/components/profile/RealProfileBio";
import { ActivityOverview } from "@/components/profile/ActivityOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Upload, 
  Edit3, 
  BarChart3, 
  Database as DatabaseIcon, 
  User,
  LogIn,
  UserPlus,
  AlertCircle
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const ProfileRealTest = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authData, setAuthData] = useState({
    email: 'testuser123@gmail.com',
    password: 'testpassword123'
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth check error:', error);
          setIsAuthenticated(false);
        } else if (user) {
          console.log('User authenticated:', user.email);
          setIsAuthenticated(true);
          await fetchProfile(user.id);
        } else {
          console.log('No authenticated user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
            full_name: 'Test User',
            username: 'testuser',
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

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to confirm.",
        });
        setIsAuthenticated(true);
        setShowAuthForm(false);
        await fetchProfile(data.user.id);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account.",
      });
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Success!",
          description: "Signed in successfully.",
        });
        setIsAuthenticated(true);
        setShowAuthForm(false);
        await fetchProfile(data.user.id);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in.",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setProfile(null);
      setCompletionProgress(0);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAvatarUpdate = (url: string | null) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
  };

  const handleBioUpdate = (bio: string) => {
    setProfile(prev => prev ? { ...prev, bio } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
              <DatabaseIcon className="h-5 w-5" />
              Real Database Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="font-medium">
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
                {profile && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {profile.full_name || 'No name'} ({profile.user_type || 'No type'})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {isAuthenticated ? (
                  <Button onClick={handleSignOut} variant="outline">
                    Sign Out
                  </Button>
                ) : (
                  <Button onClick={() => setShowAuthForm(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Form */}
        {showAuthForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {authMode === 'signin' ? (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={authMode === 'signin' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('signin')}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button
                  variant={authMode === 'signup' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('signup')}
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="testuser123@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="testpassword123"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={authMode === 'signin' ? handleSignIn : handleSignUp}
                  className="flex-1"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAuthForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Content */}
        {isAuthenticated && profile ? (
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

              {/* Activity Overview */}
              <ActivityOverview profile={profile} />
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <DatabaseIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Connect to Real Database</h3>
              <p className="text-muted-foreground mb-4">
                Sign in or create an account to test the profile functionality with real Supabase data.
              </p>
              <Button onClick={() => setShowAuthForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
