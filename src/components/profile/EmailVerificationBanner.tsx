import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

interface EmailVerificationBannerProps {
  onEmailVerified?: () => void;
}

export const EmailVerificationBanner = ({ onEmailVerified }: EmailVerificationBannerProps) => {
  const { toast } = useToast();
  const [emailStatus, setEmailStatus] = useState<'checking' | 'verified' | 'unverified' | 'error'>('checking');
  const [resending, setResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    checkEmailVerificationStatus();
  }, []);

  const checkEmailVerificationStatus = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setEmailStatus('error');
        return;
      }

      setUserEmail(user.email || '');
      setEmailStatus(user.email_confirmed_at ? 'verified' : 'unverified');
    } catch (error) {
      console.error('Error checking email verification status:', error);
      setEmailStatus('error');
    }
  };

  const resendVerificationEmail = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verified=true`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your email and click the verification link.",
      });
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: error.message || "Please try again later.",
      });
    } finally {
      setResending(false);
    }
  };

  const handleRefreshStatus = () => {
    setEmailStatus('checking');
    checkEmailVerificationStatus();
  };

  // Don't show banner if email is verified
  if (emailStatus === 'verified') {
    return null;
  }

  return (
    <Alert className={`mb-6 ${
      emailStatus === 'unverified' 
        ? 'border-amber-200 bg-amber-50' 
        : emailStatus === 'error'
        ? 'border-red-200 bg-red-50'
        : 'border-blue-200 bg-blue-50'
    }`}>
      {emailStatus === 'checking' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription className="text-blue-800">
            Checking email verification status...
          </AlertDescription>
        </>
      )}

      {emailStatus === 'unverified' && (
        <>
          <Mail className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Email verification required</strong>
                <p className="text-sm mt-1">
                  Please verify your email address ({userEmail}) to access all features.
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resendVerificationEmail}
                  disabled={resending}
                  className="text-amber-800 border-amber-300 hover:bg-amber-100"
                >
                  {resending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-3 w-3 mr-1" />
                      Resend Email
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRefreshStatus}
                  className="text-amber-800 hover:bg-amber-100"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </AlertDescription>
        </>
      )}

      {emailStatus === 'error' && (
        <>
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Unable to check email status</strong>
                <p className="text-sm mt-1">
                  There was an error checking your email verification status.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefreshStatus}
                className="text-red-800 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};

