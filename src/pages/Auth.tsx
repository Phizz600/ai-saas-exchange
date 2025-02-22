
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }
        
        if (session) {
          console.log("Auth: User already logged in, checking user type");
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("Profile error:", profileError);
            // Navigate to a default route if we can't determine the user type
            navigate("/marketplace");
            return;
          }

          // Navigate based on user type
          if (profile?.user_type === 'ai_investor') {
            navigate("/coming-soon");
          } else if (profile?.user_type === 'ai_builder') {
            navigate("/list-product");
          } else {
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
        console.log("Auth: User signed in, navigating based on user type");
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle(); // Using maybeSingle instead of single to handle cases where profile might not exist yet

          // If there's no profile yet (which can happen right after signup), 
          // or if there's an error, redirect to marketplace
          if (profileError || !profile) {
            console.log("No profile found or error occurred, redirecting to marketplace");
            navigate("/marketplace");
            return;
          }

          // Navigate based on user type
          if (profile.user_type === 'ai_investor') {
            navigate("/coming-soon");
          } else if (profile.user_type === 'ai_builder') {
            navigate("/list-product");
          } else {
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
