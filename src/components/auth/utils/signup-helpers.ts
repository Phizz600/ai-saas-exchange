
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BrevoTrack, sendBrevoEmail } from "@/integrations/supabase/brevo";

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
        console.log("AuthForm: New user detected, sending welcome email and tracking signup");
        
        // Track signup event in Brevo using JS-style tracking
        const trackingResult = await BrevoTrack.push([
          "track",
          "new_user_sign_up", // Using the event name from the example
          {
            email,
            FIRSTNAME: firstName,
            LASTNAME: "", // We don't collect last name in our form
          },
          {
            id: data.user.id,
            data: {
              time: new Date().toISOString(),
              userType: userType,
            }
          }
        ]);
        
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
