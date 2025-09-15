import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RealProfileAvatar } from "./RealProfileAvatar";
import { MapPin, Calendar, Globe2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationBadges } from "./VerificationBadges";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface RealProfileHeaderProps {
  profile: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    user_type: string | null;
    created_at: string;
  };
  onAvatarUpdate: (url: string | null) => void;
  isAuthenticated: boolean;
}

export const RealProfileHeader = ({ profile, onAvatarUpdate, isAuthenticated }: RealProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Card className="sticky top-8">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <RealProfileAvatar
            avatarUrl={profile.avatar_url}
            userId={profile.id}
            onAvatarUpdate={onAvatarUpdate}
            isAuthenticated={isAuthenticated}
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
              onClick={() => navigate('/product-dashboard')}
            >
              Dashboard
            </Button>
            {profile.user_type === "ai_builder" && (
              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white"
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



