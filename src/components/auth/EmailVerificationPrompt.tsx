import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw
} from "lucide-react";

interface EmailVerificationPromptProps {
  email: string;
  onVerified: () => void;
  onResend?: () => void;
}

export const EmailVerificationPrompt = ({ 
  email, 
  onVerified, 
  onResend 
}: EmailVerificationPromptProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    if (resendCount >= 3) {
      toast({
        variant: "destructive",
        title: "Too Many Attempts",
        description: "You've reached the limit for resending verification emails. Please wait 15 minutes before trying again.",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setResendCount(prev => prev + 1);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email and click the verification link.",
      });

      if (onResend) {
        onResend();
      }
    } catch (error: any) {
      console.error("Error resending verification:", error);
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: error.message || "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }

      if (user?.email_confirmed_at) {
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
        });
        onVerified();
      } else {
        toast({
          variant: "destructive",
          title: "Not Verified Yet",
          description: "Please check your email and click the verification link.",
        });
      }
    } catch (error: any) {
      console.error("Error checking verification:", error);
      toast({
        variant: "destructive",
        title: "Verification Check Failed",
        description: "Failed to check verification status. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your email and click the link to verify your account.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={handleCheckVerification}
            className="w-full"
            variant="outline"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            I've Verified My Email
          </Button>

          <Button 
            onClick={handleResendVerification}
            disabled={isResending || resendCount >= 3}
            variant="secondary"
            className="w-full"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        {resendCount > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Resend attempts: {resendCount}/3
          </p>
        )}

        <div className="text-sm text-muted-foreground text-center">
          <p>Didn't receive the email?</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure the email address is correct</li>
            <li>• Wait a few minutes for delivery</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
