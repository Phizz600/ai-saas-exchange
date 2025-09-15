import { useState, useEffect } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface MockProfileAvatarProps {
  avatarUrl: string | null;
  userId: string;
  onAvatarUpdate: (url: string | null) => void;
}

export const MockProfileAvatar = ({ avatarUrl, userId, onAvatarUpdate }: MockProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPEG, GIF, etc.)",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      setIsUploading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a local URL for the selected image file
      const localUrl = URL.createObjectURL(file);
      
      onAvatarUpdate(localUrl);
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      
      // Simulate removal delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clean up the local URL if it exists
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
      
      onAvatarUpdate(null);
      toast({
        title: "Success",
        description: "Profile photo removed successfully",
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="w-32 h-32">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-primary/10">
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          ) : (
            <Camera className="w-8 h-8 text-primary" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
            onClick={() => document.getElementById('mock-avatar-upload')?.click()}
            disabled={isUploading}
          >
            <Camera className="w-4 h-4" />
          </Button>
          {avatarUrl && (
            <Button
              variant="destructive"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={handleRemoveAvatar}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <input
        type="file"
        id="mock-avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};
