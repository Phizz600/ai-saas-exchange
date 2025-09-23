import { useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  userId: string;
  onAvatarUpdate: (url: string | null) => void;
}

export const ProfileAvatar = ({ avatarUrl, userId, onAvatarUpdate }: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please choose an image under 5MB.",
        });
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please choose a JPG, PNG, GIF, or WebP image.",
        });
        return;
      }

      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true // Replace existing file
        });

      if (uploadError) throw uploadError;

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
        // Don't throw here, as the upload was successful
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      let errorMessage = "Failed to update profile photo. Please try again.";
      
      if (error.message?.includes('File size')) {
        errorMessage = "File is too large. Please choose an image under 5MB.";
      } else if (error.message?.includes('Invalid file type')) {
        errorMessage = "Invalid file type. Please choose a JPG, PNG, or GIF image.";
      } else if (error.message?.includes('storage')) {
        errorMessage = "Storage error. Please try again in a moment.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      
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
        // Continue with profile update even if storage cleanup fails
      }
      
      // Update profile to remove avatar_url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(null);
      toast({
        title: "Success",
        description: "Profile photo removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      let errorMessage = "Failed to remove profile photo. Please try again.";
      
      if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please refresh the page and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Remove Failed",
        description: errorMessage,
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
            className="bg-[#8B5CF6]/90 hover:bg-[#8B5CF6] text-white"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={isUploading}
          >
            <Camera className="w-4 h-4" />
          </Button>
          {avatarUrl && (
            <Button
              variant="destructive"
              size="sm"
              className="bg-[#D946EE]/90 hover:bg-[#D946EE] text-white"
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
        id="avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};