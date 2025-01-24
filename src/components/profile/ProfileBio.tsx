import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProfileBioProps {
  bio: string | null;
}

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  const maxChars = 500;
  const currentChars = bio?.length || 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-exo flex justify-between items-center">
          <span>About Me</span>
          <span className="text-sm text-muted-foreground">
            {currentChars}/{maxChars}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">
          {bio || "Tell others about yourself and your expertise..."}
        </p>
        <Progress 
          value={(currentChars / maxChars) * 100} 
          className="h-1"
        />
      </CardContent>
    </Card>
  );
};