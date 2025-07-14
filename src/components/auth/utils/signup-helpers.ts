import { supabase } from "@/integrations/supabase/client";
import { toast as toastFunction } from "@/hooks/use-toast";

type ToastProps = {
  variant?: "default" | "destructive";
  title: string;
  description: string;
  action?: React.ReactElement;
};

/**
 * Check if a user already exists with the given email
 * @param email User's email address
 * @returns Promise<boolean> - true if user exists, false otherwise
 */
const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    console.log("Checking if user exists for email:", email);
    
    // Try to sign in with a dummy password to check if user exists
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-check'
    });
    
    // If we get a specific error about invalid credentials, the user exists
    if (error) {
      console.log("Error during user existence check:", error.message);
      
      // User exists if we get these specific errors
      const userExistsErrors = [
        'Invalid login credentials',
        'Invalid email or password',
        'Email not confirmed',
        'User not found'
      ];
      
      // If the error is NOT "User not found", then the user exists
      if (!error.message.includes('User not found')) {
        console.log("User exists - detected by error message");
        return true;
      }
    }
    
    console.log("User does not exist");
    return false;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
};

/**
 * Process user signup or sign in
 * @param isSignUp Whether this is a signup or signin operation
 * @param isFormValid Whether the form data is valid
 * @param email User's email address
 * @param password User's password
 * @param firstName User's first name (for signup)
 * @param userType User type (for signup)
 * @param setErrorMessage Function to set error message
 * @param setIsLoading Function to set loading state
 * @param setIsSignUp Function to toggle between signup/signin modes
 * @param toast Toast function for notifications (optional)
 */
export const handleAuthSubmit = async (
  isSignUp: boolean,
  isFormValid: boolean,
  email: string,
  password: string, 
  firstName: string,
  userType: 'ai_builder' | 'ai_investor',
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setIsSignUp: (isSignUp: boolean) => void,
  toast?: any // Use any here to avoid type conflicts
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

      // Check if user already exists before attempting signup
      console.log("AuthForm: Checking if user already exists");
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        console.log("AuthForm: User already exists, switching to signin mode");
        setErrorMessage("An account with this email already exists. Please sign in instead.");
        setIsSignUp(false);
        setIsLoading(false);
        
        if (toast) {
          toast({
            variant: "default",
            title: "Account Already Exists",
            description: "Please sign in with your existing account.",
          });
        }
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
          },
        },
      });

      if (error) {
        console.error("AuthForm: Signup error:", error);
        
        // Handle various "user already exists" error messages
        if (
          error.message.includes("User already registered") ||
          error.message.includes("User already exists") ||
          error.message.includes("already registered") ||
          error.message.includes("already exists") ||
          error.message.includes("Email already in use") ||
          error.message.includes("already in use")
        ) {
          setErrorMessage("An account with this email already exists. Please sign in instead.");
          setIsSignUp(false);
          
          if (toast) {
            toast({
              variant: "default",
              title: "Account Already Exists",
              description: "Please sign in with your existing account.",
            });
          }
        } else if (error.message.includes("Password should be at least")) {
          setErrorMessage("Password must be at least 6 characters long.");
        } else if (error.message.includes("Invalid email")) {
          setErrorMessage("Please enter a valid email address.");
        } else if (error.message.includes("Unable to validate email")) {
          setErrorMessage("Please check your email address and try again.");
        } else {
          setErrorMessage(`Signup failed: ${error.message}`);
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
      
      // Check if this is a new user (just created)
      const isNewUser = !data.user.last_sign_in_at || 
                        (new Date(data.user.created_at).getTime() === new Date(data.user.last_sign_in_at).getTime());
      
      if (isNewUser) {
        console.log("AuthForm: New user detected, tracking signup event with Brevo");
        
        // Track new user signup event using Brevo Events API
        try {
          const trackingResult = await supabase.functions.invoke('send-brevo-email', {
            body: {
              mode: 'track_event_api',
              eventName: 'new_user_sign_up',
              identifiers: { 
                email_id: email 
              },
              contactProperties: {
                FIRSTNAME: firstName,
                LASTNAME: "",
                USER_TYPE: userType
              },
              eventProperties: {
                signup_date: new Date().toISOString(),
                user_id: data.user.id
              }
            }
          });
          
          console.log("Brevo event tracking result:", trackingResult);
        } catch (trackingError) {
          console.error("Error tracking signup event with Brevo:", trackingError);
          // Don't stop the signup process if tracking fails
        }
        
        // WELCOME EMAIL SENDING DISABLED
        console.log("AuthForm: Welcome email sending is currently disabled");
        if (toast) {
          toast({
            variant: "default",
            title: "Account Created",
            description: "Your account has been created successfully.",
          });
        }
      }
      
      // Handle the case where email verification is enabled
      if (data.session === null) {
        if (toast) {
          toast({
            title: "Verification Required",
            description: "Please check your email to verify your account before signing in.",
          });
        }
        setIsLoading(false);
        return;
      }
      
      if (toast) {
        toast({
          title: "Welcome!",
          description: "Your account has been created. Setting up your profile...",
        });
      }
      
    } else {
      console.log("AuthForm: Starting signin process");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("AuthForm: Sign in error:", error);
        
        // Provide more specific error messages for signin
        if (error.message.includes("Invalid login credentials") || 
            error.message.includes("Invalid email or password")) {
          setErrorMessage("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Please verify your email address before signing in. Check your inbox for a verification link.");
        } else if (error.message.includes("Too many requests")) {
          setErrorMessage("Too many signin attempts. Please wait a moment before trying again.");
        } else {
          setErrorMessage(`Sign in failed: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      console.log("AuthForm: Signin successful");
      if (toast) {
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
      }
    }
  } catch (error: any) {
    console.error("AuthForm: Unexpected error:", error);
    setErrorMessage(error.message || "An unexpected error occurred.");
    setIsLoading(false);
  }
};

/**
 * Handle Google Sign In
 * @param setErrorMessage Function to set error message
 * @param setIsGoogleLoading Function to set Google loading state
 */
export const handleGoogleSignIn = async (
  setErrorMessage: (message: string) => void,
  setIsGoogleLoading: (isLoading: boolean) => void
) => {
  setIsGoogleLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth',
      }
    });
    
    if (error) {
      console.error("Error during Google sign in:", error);
      setErrorMessage("Error during Google sign in: " + error.message);
    }
  } catch (error: any) {
    console.error("Unexpected error during Google sign in:", error);
    setErrorMessage("An unexpected error occurred during Google sign in.");
  } finally {
    setIsGoogleLoading(false);
  }
};

/**
 * Process password reset
 * @param email User's email address
 * @param setErrorMessage Function to set error message
 * @param setIsLoading Function to set loading state
 * @param setShowResetForm Function to toggle reset form visibility
 * @param toast Toast function for notifications
 */
export const handlePasswordReset = async (
  email: string,
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setShowResetForm: (show: boolean) => void,
  toast: (props: ToastProps) => void
) => {
  if (!email) {
    setErrorMessage("Please enter your email address.");
    return;
  }
  
  setIsLoading(true);
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth?type=recovery',
    });
    
    if (error) {
      console.error("Password reset error:", error);
      setErrorMessage(error.message);
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
      setShowResetForm(false);
    }
  } catch (error: any) {
    console.error("Unexpected error during password reset:", error);
    setErrorMessage(error.message || "An unexpected error occurred.");
  } finally {
    setIsLoading(false);
  }
};
