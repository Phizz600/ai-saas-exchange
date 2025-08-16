import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Lock, CheckCircle, Eye, EyeOff, Asterisk } from "lucide-react";
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
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 font-['Exo_2']">
            Password Updated Successfully!
          </h2>
          <p className="text-white/80">
            Your password has been changed and you are now signed in.
          </p>
        </div>
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            Redirecting you to your dashboard...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-['Exo_2']">
          Set New Password
        </h2>
        <p className="text-white/80">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-left">
          <div className="flex items-center gap-1 mb-2">
            <Label htmlFor="password" className="text-left text-white text-base">New Password</Label>
            <Asterisk className="h-3 w-3 text-red-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              disabled={isLoading}
              required
              minLength={6}
              className="pl-10 pr-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1 mb-2">
            <Label htmlFor="confirmPassword" className="text-left text-white text-base">Confirm New Password</Label>
            <Asterisk className="h-3 w-3 text-red-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              disabled={isLoading}
              required
              minLength={6}
              className="pl-10 pr-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Lock className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Password Requirements:</strong>
            <ul className="mt-1 text-sm list-disc list-inside">
              <li>At least 6 characters long</li>
              <li>Should be unique and secure</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-purple-500/30"
          disabled={isLoading || !password || !confirmPassword}
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}; 