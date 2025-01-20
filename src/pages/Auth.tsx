import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { UserTypeSelection } from "@/components/auth/UserTypeSelection";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Auth: Component mounted");
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Auth: User already logged in, redirecting to marketplace");
        navigate("/marketplace");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth: Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        if (!showUserTypeSelection) {
          console.log("Auth: User signed in, redirecting to marketplace");
          navigate("/marketplace");
        }
      }
    });

    return () => {
      console.log("Auth: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate, showUserTypeSelection]);

  return (
    <AuthLayout>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
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