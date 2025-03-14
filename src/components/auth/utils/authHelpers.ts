
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Get the current URL for use in the redirectTo
export const getRedirectUrl = () => {
  // Get the full URL without any query parameters or hash
  const url = new URL(window.location.href);
  return `${url.origin}/auth`;
};

export const handleGoogleSignIn = async (setErrorMessage: (message: string) => void, setIsGoogleLoading: (isLoading: boolean) => void) => {
  try {
    setErrorMessage("");
    setIsGoogleLoading(true);
    
    console.log("AuthForm: Starting Google sign in process");
    
    const redirectUrl = getRedirectUrl();
    console.log("AuthForm: Using redirect URL:", redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      console.error("AuthForm: Google sign in error:", error);
      setErrorMessage(`Error during Google sign in: ${error.message}`);
      setIsGoogleLoading(false);
      return;
    }
    
    if (data) {
      console.log("AuthForm: Google sign in initiated successfully, redirecting...");
    }
  } catch (error: any) {
    console.error("AuthForm: Unexpected error during Google sign in:", error);
    setErrorMessage(`Unexpected error: ${error.message || "Unknown error occurred"}`);
    setIsGoogleLoading(false);
  }
};

export const handleAuthSubmit = async (
  isSignUp: boolean,
  isFormValid: boolean,
  email: string,
  password: string, 
  firstName: string,
  userType: 'ai_builder' | 'ai_investor',
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setIsSignUp: (isSignUp: boolean) => void
) => {
  setErrorMessage("");
  setIsLoading(true);

  try {
    if (isSignUp) {
      console.log("AuthForm: Starting signup process");
      if (!isFormValid) {
        setErrorMessage("Please fill in all fields and agree to the terms of service.");
        setIsLoading(false);
        return;
      }

      console.log("AuthForm: Attempting signup with user type:", userType);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            user_type: userType,
            email_verified: true // This helps with testing
          },
        },
      });

      if (error) {
        console.error("AuthForm: Signup error:", error);
        if (error.message.includes("User already registered")) {
          setErrorMessage("This email is already registered. Please sign in instead.");
          setIsSignUp(false);
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        console.error("AuthForm: No user data returned from signup");
        setErrorMessage("An unexpected error occurred during signup.");
        setIsLoading(false);
        return;
      }

      console.log("AuthForm: Signup successful. User ID:", data.user.id);
      toast({
        title: "Welcome!",
        description: "Your account has been created. Setting up your profile...",
      });
      
    } else {
      console.log("AuthForm: Starting signin process");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("AuthForm: Sign in error:", error);
        setErrorMessage(error.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      console.log("AuthForm: Signin successful");
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    }
  } catch (error: any) {
    console.error("AuthForm: Unexpected error:", error);
    setErrorMessage(error.message || "An unexpected error occurred.");
    setIsLoading(false);
  }
};
