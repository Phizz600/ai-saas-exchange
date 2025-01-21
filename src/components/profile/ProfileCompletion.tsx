import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProfileCompletionProps {
  progress: number;
  userType: string | null;
}

export const ProfileCompletion = ({ progress, userType }: ProfileCompletionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Complete your profile to increase visibility and trust with potential {userType === "ai_builder" ? "buyers" : "sellers"}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};