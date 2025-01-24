import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface ProfileCompletionProps {
  progress: number;
  userType: string | null;
}

export const ProfileCompletion = ({ progress, userType }: ProfileCompletionProps) => {
  return (
    <Card className="animate-fade-in bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5">
      <CardHeader>
        <CardTitle className="text-lg font-exo flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#D946EE]" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress 
            value={progress} 
            className="h-2 bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20"
          />
          <p className="text-sm text-muted-foreground">
            Complete your profile to increase visibility and trust with potential {userType === "ai_builder" ? "buyers" : "sellers"}.
            {progress < 100 && (
              <span className="block mt-2 text-xs">
                Tip: Add more details to your profile to improve your chances of successful transactions.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};