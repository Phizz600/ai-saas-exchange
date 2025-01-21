import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileBioProps {
  bio: string | null;
}

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {bio || "Tell others about yourself and your expertise..."}
        </p>
      </CardContent>
    </Card>
  );
};