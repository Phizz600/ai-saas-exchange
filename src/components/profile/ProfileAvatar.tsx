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

      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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
            onClick={() => document.getElementById('avatar-upload')?.click()}
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
        id="avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};