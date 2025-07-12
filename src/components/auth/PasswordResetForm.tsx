import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface PasswordResetFormProps {
  onBack: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("[Auth] Attempting password reset for:", email);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      console.log("[Auth] Password reset response:", { resetError });

      if (resetError) {
        setError(resetError.message);
        toast({
          variant: "destructive",
          title: "Password Reset Error",
          description: resetError.message,
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Reset Link Sent",
          description: "Check your email for a link to reset your password.",
        });
      }
    } catch (error: any) {
      console.error("[Auth] Unexpected error during password reset:", error);
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

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-500 mr-2" />
            <AlertDescription className="text-blue-700">
              <div className="space-y-2">
                <div><strong>Next steps:</strong></div>
                <div>1. Check your email for a message from Supabase</div>
                <div>2. Click the "Reset Password" link in the email</div>
                <div>3. You'll be redirected back here to set your new password</div>
                <div className="text-sm mt-2 text-blue-600">
                  💡 If you don't see the email, check your spam folder. The link expires in 1 hour.
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={isLoading}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !email}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </form>
    </div>
  );
}; 