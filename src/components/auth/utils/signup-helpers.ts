import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendWelcomeEmail } from "@/integrations/supabase/functions";

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
      }
      
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

      // Send welcome email
      console.log("AuthForm: Sending welcome email to:", email);
      try {
        const emailResult = await sendWelcomeEmail(email, firstName, userType);
        console.log("Welcome email sent successfully:", emailResult);
        
        // Show a toast notifying the user about the welcome email
        toast({
          title: "Welcome Email Sent",
          description: "Check your inbox for a welcome email with next steps!",
        });
      } catch (emailError: any) {
        console.error("Error sending welcome email:", emailError);
        console.error("Error details:", emailError.message);
        // Show error toast but don't block signup
        toast({
          variant: "destructive",
          title: "Email Delivery Issue",
          description: "We couldn't send your welcome email, but your account was created successfully.",
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
