import { useState, useEffect } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RealProfileAvatarProps {
  avatarUrl: string | null;
  userId: string;
  onAvatarUpdate: (url: string | null) => void;
  isAuthenticated: boolean;
}

export const RealProfileAvatar = ({ avatarUrl, userId, onAvatarUpdate, isAuthenticated }: RealProfileAvatarProps) => {
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
      
      if (isAuthenticated) {
        // Real upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            upsert: true // Replace existing file
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          // Fallback to local URL if storage fails
          const localUrl = URL.createObjectURL(file);
          onAvatarUpdate(localUrl);
          toast({
            title: "Success (Local)",
            description: "Profile photo updated locally (storage unavailable)",
          });
          return;
        }

        // Clean up old avatar files for this user
        try {
          const { data: oldFiles } = await supabase.storage
            .from('avatars')
            .list(userId);
          
          if (oldFiles && oldFiles.length > 0) {
            const filesToDelete = oldFiles
              .filter(file => file.name !== fileName)
              .map(file => `${userId}/${file.name}`);
            
            if (filesToDelete.length > 0) {
              await supabase.storage
                .from('avatars')
                .remove(filesToDelete);
            }
          }
        } catch (cleanupError) {
          console.warn('Failed to clean up old avatar files:', cleanupError);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Update profile in database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

        if (updateError) {
          console.error('Database update error:', updateError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save profile photo to database.",
          });
          return;
        }

        onAvatarUpdate(publicUrl);
        toast({
          title: "Success",
          description: "Profile photo updated and saved to database!",
        });
      } else {
        // Mock upload for non-authenticated users
        await new Promise(resolve => setTimeout(resolve, 1500));
        const localUrl = URL.createObjectURL(file);
        onAvatarUpdate(localUrl);
        toast({
          title: "Success (Mock)",
          description: "Profile photo updated (mock mode - not saved)",
        });
      }
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
      
      if (isAuthenticated) {
        // Clean up avatar files from storage
        try {
          const { data: oldFiles } = await supabase.storage
            .from('avatars')
            .list(userId);
          
          if (oldFiles && oldFiles.length > 0) {
            const filesToDelete = oldFiles.map(file => `${userId}/${file.name}`);
            await supabase.storage
              .from('avatars')
              .remove(filesToDelete);
          }
        } catch (cleanupError) {
          console.warn('Failed to clean up avatar files from storage:', cleanupError);
        }
        
        // Update profile to remove avatar_url
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', userId);

        if (updateError) {
          console.error('Database update error:', updateError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to remove profile photo from database.",
          });
          return;
        }

        onAvatarUpdate(null);
        toast({
          title: "Success",
          description: "Profile photo removed and saved to database!",
        });
      } else {
        // Mock removal for non-authenticated users
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Clean up the local URL if it exists
        if (avatarUrl && avatarUrl.startsWith('blob:')) {
          URL.revokeObjectURL(avatarUrl);
        }
        
        onAvatarUpdate(null);
        toast({
          title: "Success (Mock)",
          description: "Profile photo removed (mock mode - not saved)",
        });
      }
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
            onClick={() => document.getElementById('real-avatar-upload')?.click()}
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
        id="real-avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};



