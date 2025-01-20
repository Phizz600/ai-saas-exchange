import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { UserTypeSelection } from "@/components/auth/UserTypeSelection";

const Auth = () => {
  const navigate = useNavigate();
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);

  useEffect(() => {
    console.log("Auth component mounted");
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User already logged in, redirecting to marketplace");
        navigate("/marketplace");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_UP') {
        console.log("User signed up, showing user type selection");
        setShowUserTypeSelection(true);
      }
      
      if (event === 'SIGNED_IN' && session) {
        if (!showUserTypeSelection) {
          console.log("User signed in, redirecting to marketplace");
          navigate("/marketplace");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showUserTypeSelection]);

  return (
    <AuthLayout>
      {showUserTypeSelection ? (
        <UserTypeSelection />
      ) : (
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3E92CC',
                  brandAccent: '#2A628F',
                },
              },
            },
            className: {
              container: 'flex flex-col gap-4',
              button: 'bg-primary hover:bg-primary/90 text-white',
              input: 'bg-white border-gray-200',
              label: 'text-gray-700',
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/marketplace`}
        />
      )}
    </AuthLayout>
  );
};

export default Auth;