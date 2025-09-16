import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  User, 
  AtSign, 
  Shield, 
  Info,
  Pencil,
  Save,
  X
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AccountSettingsProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

interface FormData {
  fullName: string;
  username: string;
  userType: "ai_builder" | "ai_investor";
}

interface FormErrors {
  fullName?: string;
  username?: string;
}

export const AccountSettings = ({ profile, onProfileUpdate }: AccountSettingsProps) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: profile.full_name || "",
    username: profile.username || "",
    userType: profile.user_type as "ai_builder" | "ai_investor" || "ai_investor",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = "Full name must be 50 characters or less";
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full name can only contain letters, spaces, hyphens, apostrophes, and periods";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be 3-20 characters";
    } else if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain lowercase letters, numbers, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (username === profile.username) return true; // Current username is always available
    
    setCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned - username is available
        return true;
      }
      
      return false; // Username is taken
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = value.trim();
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors above before saving.",
      });
      return;
    }

    // Check username availability if it changed
    if (formData.username !== profile.username) {
      const isAvailable = await checkUsernameAvailability(formData.username);
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, username: "Username is already taken" }));
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          username: formData.username,
          user_type: formData.userType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      // Update local profile state
      const updatedProfile = {
        ...profile,
        full_name: formData.fullName,
        username: formData.username,
        user_type: formData.userType,
        updated_at: new Date().toISOString(),
      };
      onProfileUpdate(updatedProfile);

      toast({
        title: "Profile Updated",
        description: "Your account settings have been updated successfully.",
      });

      setEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please refresh the page and try again.";
      } else if (error.message?.includes('validation')) {
        errorMessage = "Invalid input. Please check your data and try again.";
      } else if (error.message?.includes('username')) {
        errorMessage = "Username is already taken. Please choose a different username.";
      } else if (error.message?.includes('duplicate')) {
        errorMessage = "This information is already in use. Please choose different values.";
      }
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.full_name || "",
      username: profile.username || "",
      userType: profile.user_type as "ai_builder" | "ai_investor" || "ai_investor",
    });
    setErrors({});
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          {editing ? (
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={errors.fullName ? "border-red-500" : ""}
              maxLength={50}
            />
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <span className="text-sm">{profile.full_name || "Not set"}</span>
            </div>
          )}
          {errors.fullName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <AtSign className="h-4 w-4" />
            Username
          </Label>
          {editing ? (
            <div className="space-y-2">
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                placeholder="Enter your username"
                className={errors.username ? "border-red-500" : ""}
                maxLength={20}
              />
              {checkingUsername && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking availability...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <span className="text-sm">@{profile.username || "Not set"}</span>
            </div>
          )}
          {errors.username && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.username}
            </p>
          )}
        </div>

        {/* User Type Field */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Account Type
          </Label>
          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.userType === "ai_builder" 
                    ? "border-[#D946EE] bg-gradient-to-r from-[#D946EE]/5 to-[#8B5CF6]/5" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="ai_builder"
                    checked={formData.userType === "ai_builder"}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as "ai_builder" | "ai_investor" }))}
                    className="text-[#D946EE]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">AI Builder</span>
                      <Badge className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white border-0">Creator</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create and sell AI products, tools, and services
                    </p>
                  </div>
                </label>
                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.userType === "ai_investor" 
                    ? "border-[#0EA4E9] bg-gradient-to-r from-[#0EA4E9]/5 to-[#8B5CF6]/5" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="ai_investor"
                    checked={formData.userType === "ai_investor"}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as "ai_builder" | "ai_investor" }))}
                    className="text-[#0EA4E9]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">AI Investor</span>
                      <Badge variant="outline" className="border-[#0EA4E9] text-[#0EA4E9]">Buyer</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discover and invest in AI products and opportunities
                    </p>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {profile.user_type === "ai_builder" ? "AI Builder" : "AI Investor"}
                </span>
                <Badge variant={profile.user_type === "ai_builder" ? "secondary" : "outline"}>
                  {profile.user_type === "ai_builder" ? "Creator" : "Buyer"}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={loading || checkingUsername}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              className="flex-1"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
