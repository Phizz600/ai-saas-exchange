
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth: Component mounted");
    
    // Handle OAuth redirect if present in URL
    const handleOAuthRedirect = async () => {
      try {
        // Check if there's an access_token or error in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const error = hashParams.get('error');
        
        if (error) {
          console.error("Auth: OAuth error:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: `Error during authentication: ${error}`,
          });
          return;
        }
        
        if (accessToken) {
          console.log("Auth: Found access token in URL, handling OAuth callback");
        }
      } catch (err) {
        console.error("Auth: Error handling OAuth redirect:", err);
      }
    };
    
    const handleEmailConfirmation = async () => {
      // Check URL for email confirmation parameters
      const url = new URL(window.location.href);
      const token_hash = url.hash.substring(1);
      
      if (token_hash && (url.searchParams.has('type') || token_hash.includes('type='))) {
        try {
          console.log("Auth: Handling email confirmation");

          // Check if this is a password reset or email confirmation
          if (url.searchParams.get('type') === 'recovery' || token_hash.includes('type=recovery')) {
            // Handle password reset
            console.log("Auth: Password reset flow detected");
            toast({
              title: "Password Reset",
              description: "Please enter your new password.",
            });
            return;
          }
  
          // Email confirmation
          console.log("Auth: Email confirmation detected");
          
          // In email verification flow, don't navigate immediately
          // This prevents redirecting the original tab unexpectedly
          if (window.opener) {
            // If this is the popup/new tab, show a message to close it
            toast({
              title: "Email Verified",
              description: "Your email has been verified. You can now close this tab and sign in.",
            });
            // Optionally notify the opener window to refresh
            try {
              window.opener.postMessage('EMAIL_VERIFIED', window.location.origin);
            } catch (e) {
              console.error("Error posting message to opener:", e);
            }
          } else {
            // If this is the main window, just show toast
            toast({
              title: "Email Verified",
              description: "Your email has been verified. You can now sign in.",
            });
          }
        } catch (error) {
          console.error("Auth: Error processing confirmation:", error);
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: "There was a problem verifying your email. Please try again.",
          });
        }
      }
    };
    
    handleOAuthRedirect();
    handleEmailConfirmation();
    
    const checkProfileAndRedirect = async (userId: string, retryCount = 0) => {
      console.log(`Auth: Checking profile for user: ${userId} (attempt ${retryCount + 1})`);
      
      try {
        // First, check if the user exists in auth.users
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Auth: Error getting user:", userError);
          throw userError;
        }

        if (!user) {
          console.error("Auth: No user found in auth.users");
          throw new Error("User not found");
        }

        // Then check for profile with exponential backoff
        const waitTime = Math.min(1000 * Math.pow(2, retryCount), 5000); // Cap at 5 seconds
        console.log(`Auth: Waiting ${waitTime}ms before checking profile...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, id')
          .eq('id', userId)
          .maybeSingle();
        
        console.log("Auth: Profile check response:", { profile, profileError });

        if (profileError) {
          console.error("Auth: Profile check error:", profileError);
          throw profileError;
        }

        // If no profile exists and we haven't exceeded retries
        if (!profile) {
          if (retryCount < 5) { // Increase max retries to 5
            console.log(`Auth: No profile found, retrying... (attempt ${retryCount + 1})`);
            return await checkProfileAndRedirect(userId, retryCount + 1);
          }
          console.error("Auth: Profile not found after multiple retries");
          throw new Error("Profile not found after multiple retries");
        }

        // If user type is not set, redirect to user type selection
        if (!profile.user_type) {
          console.log("Auth: Profile missing user_type, redirecting to user type selection");
          navigate("/user-type-selection");
          return;
        }

        console.log("Auth: Found profile with user_type:", profile.user_type);

        // Redirect based on user type
        switch (profile.user_type) {
          case 'ai_investor':
            console.log("Auth: Redirecting investor to coming-soon page");
            navigate("/coming-soon");
            break;
          case 'ai_builder':
            console.log("Auth: Redirecting builder to list-product");
            navigate("/list-product");
            break;
          default:
            console.error("Auth: Invalid user type detected:", profile.user_type);
            navigate("/user-type-selection");
            break;
        }
      } catch (error: any) {
        console.error("Auth: Error in profile check:", error);
        toast({
          variant: "destructive",
          title: "Error Creating Account",
          description: "There was a problem setting up your profile. Please try signing in again.",
        });
        // Sign out the user and stay on auth page
        await supabase.auth.signOut();
      }
    };

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth: Session check error:", sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log("Auth: User already logged in with ID:", session.user.id);
          await checkProfileAndRedirect(session.user.id);
        }
      } catch (error) {
        console.error("Auth: Error checking session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your login status. Please try again.",
        });
      }
    };
    
    checkSession();

    // Listen for messages from the popup window
    const messageHandler = (event: MessageEvent) => {
      if (event.data === 'EMAIL_VERIFIED') {
        console.log("Auth: Received EMAIL_VERIFIED message from verification window");
        // Refresh the page or update the UI as needed
        window.location.reload();
      }
    };
    
    window.addEventListener('message', messageHandler);

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth: Auth state changed:", event, session?.user?.id);
      
      if (event === "SIGNED_IN" && session?.user) {
        await checkProfileAndRedirect(session.user.id);
      }
    });

    return () => {
      console.log("Auth: Cleaning up subscription");
      subscription.unsubscribe();
      window.removeEventListener('message', messageHandler);
    };
  }, [navigate, toast]);

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Auth;
