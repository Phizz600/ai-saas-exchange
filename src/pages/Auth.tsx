
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
      
      // Add delay for the first attempt to allow the profile creation to complete
      if (retryCount === 0) {
        console.log("Auth: Initial delay to allow profile creation");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, id')
          .eq('id', userId)
          .maybeSingle();
        
        console.log("Auth: Profile check response:", { profile, profileError });

        if (profileError) {
          console.error("Auth: Error fetching profile:", profileError);
          if (retryCount < 3) {
            console.log(`Auth: Will retry after error (attempt ${retryCount + 1})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return checkProfileAndRedirect(userId, retryCount + 1);
          }
          throw profileError;
        }

        if (!profile) {
          if (retryCount < 3) {
            console.log(`Auth: No profile found, retrying in 2s (attempt ${retryCount + 1})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return checkProfileAndRedirect(userId, retryCount + 1);
          }
          throw new Error("Profile not found after multiple retries");
        }

        console.log("Auth: Found profile:", profile);

        if (!profile.user_type) {
          console.error("Auth: Profile found but missing user_type");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Your profile is incomplete. Please try logging out and back in.",
          });
          return;
        }

        // Navigate based on user type
        switch (profile.user_type) {
          case 'ai_investor':
            console.log("Auth: Redirecting investor to marketplace");
            navigate("/marketplace");
            break;
          case 'ai_builder':
            console.log("Auth: Redirecting builder to list-product");
            navigate("/list-product");
            break;
          default:
            console.error("Auth: Invalid user type detected:", profile.user_type);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Invalid user type detected. Please contact support.",
            });
            navigate("/marketplace");
            break;
        }
      } catch (error) {
        console.error("Auth: Error in profile check:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem loading your profile. Please try logging out and back in.",
        });
        // Sign out the user if we can't load their profile after all retries
        if (retryCount >= 3) {
          console.log("Auth: Signing out user after multiple failed attempts");
          await supabase.auth.signOut();
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

