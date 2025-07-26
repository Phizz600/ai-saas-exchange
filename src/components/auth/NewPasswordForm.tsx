import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewPasswordFormProps {
  onSuccess?: () => void;
}

export const NewPasswordForm = ({ onSuccess }: NewPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePasswords = () => {
    if (!password) {
      setError("Please enter a new password.");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    
    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("[Auth] Updating password");
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        console.error("[Auth] Password update error:", updateError);
        setError(updateError.message);
        toast({
          variant: "destructive",
          title: "Password Update Failed",
          description: updateError.message,
        });
      } else {
        console.log("[Auth] Password updated successfully");
        setSuccess(true);
        toast({
          title: "Password Updated Successfully! 🎉",
          description: "Your password has been changed. You are now signed in.",
        });
        
        // Call success callback or navigate
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate to dashboard after successful password reset
          setTimeout(() => {
            navigate('/product-dashboard');
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("[Auth] Unexpected error during password update:", error);
      setError(error.message || "An unexpected error occurred.");
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Updated Successfully!
          </h2>
          <p className="text-gray-600">
            Your password has been changed and you are now signed in.
          </p>
        </div>
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <AlertDescription className="text-green-700">
            Redirecting you to your dashboard...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set New Password
        </h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              disabled={isLoading}
              required
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              disabled={isLoading}
              required
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Alert className="bg-blue-50 border-blue-200">
            <Lock className="h-4 w-4 text-blue-500 mr-2" />
            <AlertDescription className="text-blue-700">
              <strong>Password Requirements:</strong>
              <ul className="mt-1 text-sm list-disc list-inside">
                <li>At least 6 characters long</li>
                <li>Should be unique and secure</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !password || !confirmPassword}
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}; 