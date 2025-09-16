import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";

interface ProfileBioProps {
  bio: string | null;
  userId: string;
  onBioUpdate?: (newBio: string) => void;
}

export const ProfileBio = ({ bio, userId, onBioUpdate }: ProfileBioProps) => {
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState(bio || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const maxChars = 500;
  const currentChars = newBio.length;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bio: newBio })
        .eq("id", userId);

      if (error) throw error;

      // Call the callback to update parent component
      if (onBioUpdate) {
        onBioUpdate(newBio);
      }

      toast({
        title: "Success",
        description: "Your bio has been updated.",
      });
      setEditing(false);
    } catch (error: any) {
      console.error("Error updating bio:", error);
      let errorMessage = "Failed to update bio. Please try again.";
      
      if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please refresh the page and try again.";
      } else if (error.message?.includes('validation')) {
        errorMessage = "Invalid bio content. Please check your input and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
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
              <Button onClick={handleSave} disabled={isLoading}>
                Save Changes
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