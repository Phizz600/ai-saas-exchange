
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
    
    const checkProfileAndRedirect = async (userId: string, retryCount = 0) => {
      console.log(`Auth: Checking profile for user: ${userId} (attempt ${retryCount + 1})`);
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, id')
          .eq('id', userId)
          .maybeSingle();
        
        console.log("Auth: Profile check response:", { profile, profileError });

        if (profileError) {
          throw profileError;
        }

        // Handle case where profile doesn't exist
        if (!profile && retryCount < 3) {
          console.log(`Auth: No profile found, retrying in 2s (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return checkProfileAndRedirect(userId, retryCount + 1);
        }

        if (!profile) {
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
      } catch (error) {
        console.error("Auth: Error in profile check:", error);
        if (retryCount >= 3) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem loading your profile. Please try logging out and back in.",
          });
          await supabase.auth.signOut();
          navigate("/auth");
        } else {
          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          return checkProfileAndRedirect(userId, retryCount + 1);
        }
      }
    };

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
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
    };
  }, [navigate, toast]);

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Auth;
