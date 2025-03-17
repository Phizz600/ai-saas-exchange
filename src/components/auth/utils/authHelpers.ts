
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendBrevoEmail, trackBrevoEvent } from "@/integrations/supabase/functions";

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
            // Removed email_verified: true to allow Supabase's email verification flow
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
      
      // Track signup event in Brevo
      const trackingResult = await trackBrevoEvent(
        'user_signup',
        {
          email,
          FIRSTNAME: firstName,
          LASTNAME: "",
          user_type: userType
        },
        {
          id: data.user.id,
          data: {
            signupDate: new Date().toISOString(),
            userType: userType
          }
        }
      );
      
      console.log("Brevo tracking result:", trackingResult);
      
      // Send welcome email via Brevo
      const emailResult = await sendBrevoEmail(
        'user_signup',
        email,
        undefined,
        { 
          firstName,
          userType 
        }
      );
      
      console.log("Brevo email result:", emailResult);
      
      // Handle the case where email verification is enabled
      if (data.session === null) {
        toast({
          title: "Verification Required",
          description: "Please check your email to verify your account before signing in.",
        });
        setIsLoading(false);
        return;
      }
      
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
