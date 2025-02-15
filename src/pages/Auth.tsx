
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Auth: Component mounted");
    console.log("Location state:", location.state);
    
    const checkSession = async () => {
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
          .maybeSingle();
        
        if (profileError) {
          console.error("Profile error:", profileError);
          return;
        }

        // If we have a stored redirect path, use it
        const redirectPath = location.state?.from || '/marketplace';
        console.log("Redirecting to:", redirectPath);
        
        // Check if the user is trying to access list-product
        if (redirectPath === '/list-product') {
          if (profile?.user_type === 'ai_builder') {
            navigate(redirectPath);
          } else {
            navigate('/marketplace');
          }
        } else if (profile?.user_type === 'ai_investor') {
          navigate("/coming-soon");
        } else {
          navigate(redirectPath);
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth: Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        console.log("Auth: User signed in, checking user type");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile error:", profileError);
          return;
        }

        // If we have a stored redirect path, use it
        const redirectPath = location.state?.from || '/marketplace';
        console.log("Redirecting to:", redirectPath);

        // Check if the user is trying to access list-product
        if (redirectPath === '/list-product') {
          if (profile?.user_type === 'ai_builder') {
            navigate(redirectPath);
          } else {
            navigate('/marketplace');
          }
        } else if (profile?.user_type === 'ai_investor') {
          navigate("/coming-soon");
        } else {
          navigate(redirectPath);
        }
      }
    });

    return () => {
      console.log("Auth: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Auth;
