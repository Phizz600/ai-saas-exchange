import { useState } from "react";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Navbar } from "@/components/Navbar";
import { MockProfileHeader } from "@/components/profile/MockProfileHeader";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";
import { MockProfileBio } from "@/components/profile/MockProfileBio";
import { ActivityOverview } from "@/components/profile/ActivityOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Edit3, BarChart3 } from "lucide-react";

// Mock profile data for testing
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
  liked_products: ["prod-1", "prod-2", "prod-3"],
  location: "United States",
  website: "https://johndoe.dev"
};

export const ProfileTest = () => {
  const [profile, setProfile] = useState(mockProfile);
  const [completionProgress, setCompletionProgress] = useState(80);

  const calculateCompletionProgress = (profile: typeof mockProfile) => {
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
    setProfile(prev => ({ ...prev, avatar_url: url }));
    setCompletionProgress(calculateCompletionProgress({ ...profile, avatar_url: url }));
  };

  const handleBioUpdate = (newBio: string) => {
    setProfile(prev => ({ ...prev, bio: newBio }));
    setCompletionProgress(calculateCompletionProgress({ ...profile, bio: newBio }));
  };

  return (
    <div className="min-h-screen bg-white">
      <PromotionalBanner />
      <Navbar />
      <div className="container mx-auto px-3 py-8 mt-20">
        {/* Test Header */}
        <Card className="mb-6 bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5 border-[#D946EE]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Profile Functionality Test (No Login Required)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Upload className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Profile Picture</h4>
                  <p className="text-sm text-muted-foreground">Upload/Remove functional</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Edit3 className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">About Me</h4>
                  <p className="text-sm text-muted-foreground">Fully editable</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-semibold">Activity Data</h4>
                  <p className="text-sm text-muted-foreground">Mock realistic data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <MockProfileHeader 
              profile={profile} 
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            {/* Profile Completion */}
            <ProfileCompletion progress={completionProgress} userType={profile.user_type} />
            
            {/* Bio Section */}
            <MockProfileBio 
              bio={profile.bio} 
              userId={profile.id} 
              onBioUpdate={handleBioUpdate}
            />

            {/* Activity Overview */}
            <ActivityOverview profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};
