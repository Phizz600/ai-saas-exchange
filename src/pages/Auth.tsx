import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { AuthError, AuthChangeEvent } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState<"ai_builder" | "ai_investor">("ai_builder");
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);

  useEffect(() => {
    console.log("Auth component mounted");
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User already logged in, redirecting to marketplace");
        navigate("/marketplace");
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event);
      
      if (event === AuthChangeEvent.SIGNED_UP) {
        console.log("User signed up, showing user type selection");
        setShowUserTypeSelection(true);
      }
      
      if (event === AuthChangeEvent.SIGNED_IN && session) {
        if (!showUserTypeSelection) {
          console.log("User signed in, redirecting to marketplace");
          navigate("/marketplace");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showUserTypeSelection]);

  const handleUserTypeSubmit = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      
      console.log("User type updated successfully");
      navigate("/marketplace");
    } catch (error) {
      console.error("Error updating user type:", error);
      setErrorMessage("Failed to update user type. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-accent3 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to AI Exchange</h1>
          <p className="text-gray-300">Sign in or create an account to continue</p>
        </div>

        <div className="bg-card rounded-lg shadow-xl p-8">
          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {showUserTypeSelection ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">What best describes you?</h2>
              <RadioGroup
                value={userType}
                onValueChange={(value) => setUserType(value as "ai_builder" | "ai_investor")}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ai_builder" id="ai_builder" />
                  <Label htmlFor="ai_builder">AI Builder</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ai_investor" id="ai_investor" />
                  <Label htmlFor="ai_investor">AI Investor</Label>
                </div>
              </RadioGroup>
              <button
                onClick={handleUserTypeSubmit}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default Auth;