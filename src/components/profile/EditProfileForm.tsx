import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Mail, User, AlertTriangle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface EditProfileFormProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

interface FormData {
  fullName: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

interface UpdateStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export const EditProfileForm = ({ profile, onProfileUpdate }: EditProfileFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: profile.full_name || "",
    email: "", // Will be loaded from auth user
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({ type: 'idle' });
  const [loading, setLoading] = useState(true);
  const [emailChanged, setEmailChanged] = useState(false);

  // Load current user email
  useEffect(() => {
    const loadUserEmail = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      } catch (error) {
        console.error("Error loading user email:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserEmail();
  }, []);

  // Track email changes
  useEffect(() => {
    const checkEmailChange = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const currentEmail = user?.email || "";
      setEmailChanged(formData.email !== currentEmail);
    };
    
    checkEmailChange();
  }, [formData.email]);

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/<[^>]*>/g, ''); // Remove HTML tags
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setUpdateStatus({ type: 'error', message: 'Please fix the errors above' });
      return;
    }

    setUpdateStatus({ type: 'loading' });

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found');
      }

      // Call our Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      // Update local profile state
      const updatedProfile = {
        ...profile,
        full_name: formData.fullName.trim(),
        updated_at: new Date().toISOString(),
      };
      onProfileUpdate(updatedProfile);

      setUpdateStatus({ 
        type: 'success', 
        message: emailChanged 
          ? 'Profile updated! Please check your email to verify the new address.'
          : 'Profile updated successfully!'
      });

      toast({
        title: "Profile Updated",
        description: emailChanged 
          ? "Your profile has been updated. Please check your email to verify the new address."
          : "Your profile has been updated successfully.",
      });

    } catch (error: any) {
      console.error("Error updating profile:", error);
      setUpdateStatus({ 
        type: 'error', 
        message: error.message || 'Failed to update profile. Please try again.' 
      });
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.full_name || "",
      email: "", // Will be reset when component re-mounts
    });
    setErrors({});
    setUpdateStatus({ type: 'idle' });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Edit Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Messages */}
          {updateStatus.type === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {updateStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {updateStatus.type === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {updateStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Email Change Warning */}
          {emailChanged && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Changing your email will require verification. You'll receive a confirmation email at the new address.
              </AlertDescription>
            </Alert>
          )}

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={errors.fullName ? "border-red-500" : ""}
              maxLength={50}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Changing your email will require verification at the new address.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={updateStatus.type === 'loading'}
              className="flex-1"
            >
              {updateStatus.type === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateStatus.type === 'loading'}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
