
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
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Auth: User already logged in, checking user type");
          // Use sleep to ensure profile has been created
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError || !profile) {
            console.log("No profile found or error occurred, redirecting to marketplace");
            navigate("/marketplace");
            return;
          }

          console.log("Auth: Found user type:", profile.user_type);

          // Navigate based on user type
          if (profile.user_type === 'ai_investor') {
            console.log("Auth: Redirecting investor to coming-soon");
            navigate("/coming-soon");
          } else if (profile.user_type === 'ai_builder') {
            console.log("Auth: Redirecting builder to list-product");
            navigate("/list-product");
          } else {
            console.log("Auth: Redirecting to marketplace (default)");
            navigate("/marketplace");
          }
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your login status. Please try again.",
        });
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth: Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        console.log("Auth: User signed in, waiting for profile creation...");
        
        try {
          // Increase delay to ensure the profile has been created
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError || !profile) {
            console.log("No profile found or error occurred, redirecting to marketplace");
            navigate("/marketplace");
            return;
          }

          console.log("Auth: Found user type after sign in:", profile.user_type);

          // Navigate based on user type
          if (profile.user_type === 'ai_investor') {
            console.log("Auth: Redirecting investor to coming-soon");
            navigate("/coming-soon");
          } else if (profile.user_type === 'ai_builder') {
            console.log("Auth: Redirecting builder to list-product");
            navigate("/list-product");
          } else {
            console.log("Auth: Redirecting to marketplace (default)");
            navigate("/marketplace");
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem with the login process. Please try again.",
          });
          navigate("/marketplace");
        }
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
