
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
          .select('user_type')
          .eq('id', userId)
          .maybeSingle();
        
        if (profileError) {
          console.error("Auth: Error fetching profile:", profileError);
          throw profileError;
        }

        if (!profile && retryCount < 3) {
          console.log(`Auth: No profile found, retrying in 2s (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return checkProfileAndRedirect(userId, retryCount + 1);
        }

        if (!profile || !profile.user_type) {
          console.error("Auth: No profile or user_type found after retries");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load your profile. Please try logging out and back in.",
          });
          navigate("/marketplace");
          return;
        }

        console.log("Auth: Found user type:", profile.user_type);

        // Navigate based on user type
        switch (profile.user_type) {
          case 'ai_investor':
            console.log("Auth: Redirecting investor to coming-soon");
            navigate("/coming-soon");
            break;
          case 'ai_builder':
            console.log("Auth: Redirecting builder to list-product");
            navigate("/list-product");
            break;
          default:
            console.log("Auth: Redirecting to marketplace");
            navigate("/marketplace");
            break;
        }
      } catch (error) {
        console.error("Auth: Error in profile check:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem loading your profile. Please try again.",
        });
        navigate("/marketplace");
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
      console.log("Auth: Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session?.user) {
        console.log("Auth: User signed in with ID:", session.user.id);
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
