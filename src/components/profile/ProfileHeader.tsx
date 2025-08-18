import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { MapPin, Calendar, Globe2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationBadges } from "./VerificationBadges";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileHeaderProps {
  profile: Profile;
  onAvatarUpdate: (url: string | null) => void;
}

export const ProfileHeader = ({ profile, onAvatarUpdate }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Card className="sticky top-8">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatar
            avatarUrl={profile.avatar_url}
            userId={profile.id}
            onAvatarUpdate={onAvatarUpdate}
          />
          <h2 className="text-2xl font-semibold mb-1 mt-4 font-exo">
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
          </div>

          <VerificationBadges />

          <div className="w-full mt-4 space-y-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center justify-center text-sm text-muted-foreground cursor-help">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>Communication Policy</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">
                  Direct messaging is enabled only after a sale is initiated. This helps maintain 
                  a secure and focused marketplace environment.
                </p>
              </HoverCardContent>
            </HoverCard>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/browse-marketplace')}
            >
              Browse Products
            </Button>
            {profile.user_type === "ai_builder" && (
              <Button 
                className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
                onClick={() => navigate('/list-product')}
              >
                Create New Listing
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};