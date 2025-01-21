import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileContentProps {
  profile: Profile;
}

export const ProfileContent = ({ profile }: ProfileContentProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {profile.user_type === "ai_builder" ? "My AI Products" : "My Investments"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">
            {profile.user_type === "ai_builder" ? "No products listed yet" : "No investments yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {profile.user_type === "ai_builder"
              ? "Start selling your AI products to reach potential buyers"
              : "Browse the marketplace to find AI products to invest in"}
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate('/marketplace')}
          >
            {profile.user_type === "ai_builder" 
              ? "Create Your First Listing" 
              : "Explore Marketplace"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};