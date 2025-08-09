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
 * Note: This is now handled directly in the signup flow instead of pre-checking
 * @param email User's email address
 * @returns Promise<boolean> - always returns false to proceed with signup attempt
 */
const checkUserExists = async (email: string): Promise<boolean> => {
  // We'll let the signup attempt handle user existence detection
  // This is more reliable than trying to guess from error messages
  console.log("Proceeding with signup attempt for email:", email);
  return false;
};

/**
 * Create user profile in the database
 * @param userId User ID from auth
 * @param firstName User's first name
 * @param userType User type
 * @returns Promise<boolean> - true if successful, false otherwise
 */
const createUserProfile = async (
  userId: string, 
  firstName: string, 
  userType: 'ai_builder' | 'ai_investor'
): Promise<boolean> => {
  try {
    console.log("Creating user profile for:", userId);
    
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: firstName,
        user_type: userType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error creating profile:", error);
      return false;
    }
    
    console.log("Profile created successfully");
    return true;
  } catch (error) {
    console.error("Unexpected error creating profile:", error);
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
  lastName: string,
  newsletterOptIn: boolean,
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setIsSignUp: (isSignUp: boolean) => void,
  toast?: any, // Use any here to avoid type conflicts
  onSignupSuccess?: () => void
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

      // Skip pre-checking user existence - let Supabase handle it directly
      console.log("AuthForm: Attempting signup directly");

      console.log("AuthForm: Attempting signup with user type:", userType);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            newsletter_opt_in: newsletterOptIn,
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
          captchaToken: undefined, // Explicitly set to undefined if not using captcha
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
          error.message.includes("already in use") ||
          error.message.includes("already been registered") ||
          error.message.includes("Email address is already registered")
        ) {
          console.log("AuthForm: User already exists, switching to signin mode");
          setErrorMessage("An account with this email already exists. Please sign in instead.");
          setIsSignUp(false);
          
          if (toast) {
            toast({
              variant: "default",
              title: "Account Found!",
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
        setErrorMessage("Account creation failed. Please try again or contact support if the issue persists.");
        setIsLoading(false);
        return;
      }

      console.log("AuthForm: Signup successful. User ID:", data.user.id);
      
      // Create user profile in the database
      const profileCreated = await createUserProfile(data.user.id, firstName, userType);
      
      if (!profileCreated) {
        console.warn("AuthForm: Failed to create user profile, but continuing with signup flow");
        // Don't stop the process - the user can still verify their email and sign in
        // Profile creation can be retried later or handled during first login
      }
      
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
                LASTNAME: lastName,
                USER_TYPE: userType,
                NEWSLETTER_OPT_IN: newsletterOptIn
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
      }
      
      // Handle the case where email verification is enabled
      if (data.session === null && data.user) {
        console.log("AuthForm: Email verification required, no session created");
        console.log("AuthForm: User created with ID:", data.user.id);
        
        // Try to create user profile even without session
        const profileCreated = await createUserProfile(data.user.id, firstName, userType);
        if (!profileCreated) {
          console.warn("AuthForm: Failed to create user profile during email verification flow, but continuing");
          // Profile creation will be retried when user signs in after verification
        }
        
        // Schedule welcome email
        try {
          console.log("AuthForm: Scheduling welcome email");
          const emailResult = await supabase.functions.invoke('schedule-welcome-email', {
            body: {
              firstName,
              email,
              userType,
              timestamp: new Date().toISOString(),
              source: 'signup_verification',
              siteUrl: window.location.origin
            }
          });
          console.log("AuthForm: Welcome email scheduled:", emailResult);
        } catch (emailError) {
          console.error("AuthForm: Error scheduling welcome email:", emailError);
          // Don't stop the signup process if email scheduling fails
        }
        
        if (toast) {
          toast({
            title: "Please verify your email to log in",
            description: "Check your email inbox for a verification link from Supabase, then return here to sign in.",
          });
        }
        
        // Clear the form and show success message
        setErrorMessage(""); 
        setIsLoading(false);
        
        // Call success callback to clear form
        if (onSignupSuccess) {
          onSignupSuccess();
        }
        
        return;
      }
      
      // Handle case where neither session nor user is created (this shouldn't happen but let's be safe)
      if (!data.session && !data.user) {
        console.error("AuthForm: No session or user data returned from signup");
        setErrorMessage("Signup completed but verification status is unclear. Please try signing in.");
        setIsLoading(false);
        return;
      }
      
      // If user is automatically signed in (no email verification required)
      console.log("AuthForm: User signed up and automatically signed in");
      if (toast) {
        toast({
          title: "Welcome! 🎉",
          description: "Your account has been created successfully and you're now signed in.",
        });
      }
      
    } else {
      console.log("[Auth] Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("[Auth] Login response:", { data, error });
      
      if (error) {
        let errorMsg = error.message || "Sign in failed.";
        
        // Provide more user-friendly error messages
        if (error.message.includes("Invalid login credentials") || 
            error.message.includes("Invalid email or password")) {
          errorMsg = "Incorrect email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMsg = "Please check your email and click the verification link before signing in.";
        } else if (error.message.includes("Too many requests")) {
          errorMsg = "Too many login attempts. Please wait a moment before trying again.";
        }
        
        setErrorMessage(errorMsg);
        toast?.({
          variant: "destructive",
          title: "Sign In Error",
          description: errorMsg,
        });
        setIsLoading(false);
        return;
      }

      toast?.({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
    }
  } catch (error: any) {
    console.error("[Auth] Unexpected error:", error);
    setErrorMessage(error.message || "An unexpected error occurred.");
    toast?.({
      variant: "destructive",
      title: "Unexpected Error",
      description: error.message || "An unexpected error occurred.",
    });
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
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
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
