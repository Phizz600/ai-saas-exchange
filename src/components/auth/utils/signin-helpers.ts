
import { supabase } from "@/integrations/supabase/client";
import { getRedirectUrl } from "./url-helpers";

/**
 * Handle Google sign-in authentication flow
 * @param setErrorMessage Function to set error message
 * @param setIsGoogleLoading Function to set loading state
 */
export const handleGoogleSignIn = async (
  setErrorMessage: (message: string) => void, 
  setIsGoogleLoading: (isLoading: boolean) => void
) => {
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
          prompt: 'select_account',
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
