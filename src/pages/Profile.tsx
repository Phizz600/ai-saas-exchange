import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        console.log("Profile data:", profileData);
        setProfile(profileData);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "Profile"}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-400" />
            )}
            <div>
              <CardTitle>{profile.full_name || "Anonymous User"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {profile.user_type === "ai_builder" ? "AI Builder" : "AI Investor"}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{profile.bio || "No bio provided"}</p>
          </CardContent>
        </Card>

        {/* Conditional Content Based on User Type */}
        {profile.user_type === "ai_builder" ? (
          <Card>
            <CardHeader>
              <CardTitle>My AI Products</CardTitle>
            </CardHeader>
            <CardContent>
              {/* We'll implement the products list in the next iteration */}
              <p className="text-muted-foreground">Your listed AI products will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My Investments</CardTitle>
            </CardHeader>
            <CardContent>
              {/* We'll implement the investments list in the next iteration */}
              <p className="text-muted-foreground">Your AI investments will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};