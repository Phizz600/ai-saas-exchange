
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getRedirectUrl } from "./url-helpers";

/**
 * Handle password reset request
 * @param email User's email address
 * @param setErrorMessage Function to set error message
 * @param setIsLoading Function to set loading state
 * @param setResetEmailSent Function to indicate email was sent
 */
export const handlePasswordReset = async (
  email: string,
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setResetEmailSent: (sent: boolean) => void
) => {
  if (!email) {
    setErrorMessage("Please enter your email address.");
    return;
  }
  
  setIsLoading(true);
  setErrorMessage("");
  
  try {
    console.log("AuthForm: Starting password reset process for:", email);
    
    const redirectUrl = getRedirectUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error("AuthForm: Password reset error:", error);
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }
    
    console.log("AuthForm: Password reset email sent");
    setResetEmailSent(true);
    toast({
      title: "Reset Link Sent",
      description: "Check your email for a link to reset your password."
    });
  } catch (error: any) {
    console.error("AuthForm: Unexpected error during password reset:", error);
    setErrorMessage(error.message || "An unexpected error occurred.");
  } finally {
    setIsLoading(false);
  }
};
