import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";

interface RealProfileBioProps {
  bio: string | null;
  userId: string;
  onBioUpdate?: (newBio: string) => void;
  isAuthenticated: boolean;
}

export const RealProfileBio = ({ bio, userId, onBioUpdate, isAuthenticated }: RealProfileBioProps) => {
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState(bio || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const maxChars = 500;
  const currentChars = newBio.length;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        // Real save to database
        const { error } = await supabase
          .from("profiles")
          .update({ bio: newBio })
          .eq("id", userId);

        if (error) {
          console.error("Database error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save bio to database. Please try again.",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Your bio has been saved to the database!",
        });
      } else {
        // Mock save for non-authenticated users
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Success (Mock)",
          description: "Your bio has been updated (mock mode - not saved).",
        });
      }
      
      // Call the update callback if provided
      if (onBioUpdate) {
        onBioUpdate(newBio);
      }
      
      setEditing(false);
    } catch (error) {
      console.error("Error updating bio:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bio. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <Textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value.slice(0, maxChars))}
              placeholder="Tell others about yourself and your expertise..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setNewBio(bio || "");
                  setEditing(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="bg-black hover:bg-gray-800 text-white">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {bio || "Tell others about yourself and your expertise..."}
            </p>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Bio
            </Button>
          </div>
        )}
        <Progress value={(currentChars / maxChars) * 100} className="h-1" />
      </CardContent>
    </Card>
  );
};



