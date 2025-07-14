
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { UserTypeSelector } from "./UserTypeSelector";
import { ErrorMessage } from "./ErrorMessage";
import { NameField, EmailField, PasswordField } from "./FormFields";
import { TermsCheckbox } from "./TermsCheckbox";
import { AuthButtons } from "./AuthButtons";
import { signInWithGoogle, handleAuthSubmit, resetPassword } from "./utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle } from "lucide-react";

export const AuthForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isBuilder, setIsBuilder] = useState(false);
  const [userType, setUserType] = useState<'ai_builder' | 'ai_investor'>('ai_investor');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);
  const [showAccountExistsAlert, setShowAccountExistsAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isSignUp) {
      setIsFormValid(
        email !== "" &&
        password !== "" &&
        firstName !== "" &&
        agreedToTerms &&
        ['ai_builder', 'ai_investor'].includes(userType)
      );
    } else {
      setIsFormValid(email !== "" && password !== "");
    }
  }, [email, password, firstName, agreedToTerms, isSignUp, userType]);

  // Check for OAuth redirects when component mounts
  useEffect(() => {
    // If there's a hash in the URL, it might be an OAuth redirect
    if (window.location.hash) {
      console.log("AuthForm: Detected hash in URL, might be OAuth redirect");
      const handleRedirect = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("AuthForm: Error getting session after redirect:", error);
          setErrorMessage("Error during Google sign in: " + error.message);
          return;
        }
        if (data.session) {
          console.log("AuthForm: Successfully signed in after redirect");
          toast({
            title: "Success!",
            description: "You've been successfully logged in with Google.",
          });
        }
      };
      
      handleRedirect();
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (isSignUp) {
      setShowVerificationInfo(true);
    }
    
    await handleAuthSubmit(
      isSignUp,
      isFormValid,
      email,
      password,
      firstName,
      userType,
      setErrorMessage,
      setIsLoading,
      (newIsSignUp: boolean) => {
        setIsSignUp(newIsSignUp);
        // If switching from signup to signin, show the account exists alert
        if (!newIsSignUp && isSignUp) {
          setShowAccountExistsAlert(true);
          // Clear the alert after 5 seconds
          setTimeout(() => setShowAccountExistsAlert(false), 5000);
          // Clear the form fields when switching to signin
          setFirstName("");
          setAgreedToTerms(false);
        }
      },
      toast
    );
  };

  const handleGoogleSignInClick = async () => {
    await signInWithGoogle(setErrorMessage, setIsGoogleLoading);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage errorMessage={errorMessage} />
      
      {showVerificationInfo && isSignUp && (
        <Alert className="mb-4 bg-blue-50/90 backdrop-blur-sm border border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
          <AlertDescription className="font-medium text-blue-700">
            After signing up, you'll need to verify your email before you can sign in.
          </AlertDescription>
        </Alert>
      )}

      {showAccountExistsAlert && (
        <Alert className="mb-4 bg-green-50/90 backdrop-blur-sm border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <AlertDescription className="font-medium text-green-700">
            Account found! Please sign in with your existing account.
          </AlertDescription>
        </Alert>
      )}

      {isSignUp && (
        <NameField 
          firstName={firstName} 
          setFirstName={setFirstName}
          isLoading={isLoading}
          isGoogleLoading={isGoogleLoading}
        />
      )}

      <EmailField 
        email={email} 
        setEmail={setEmail}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
      />

      <PasswordField 
        password={password} 
        setPassword={setPassword}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
      />
      
      {isSignUp && (
        <UserTypeSelector 
          isBuilder={isBuilder} 
          setIsBuilder={setIsBuilder}
          userType={userType}
          setUserType={setUserType}
        />
      )}

      {isSignUp && (
        <TermsCheckbox 
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
          isLoading={isLoading}
          isGoogleLoading={isGoogleLoading}
        />
      )}

      <AuthButtons 
        isSignUp={isSignUp}
        isFormValid={isFormValid}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
        setIsSignUp={setIsSignUp}
        setErrorMessage={setErrorMessage}
        handleGoogleSignIn={handleGoogleSignInClick}
        setIsLoading={setIsLoading}
        setFirstName={setFirstName}
        setAgreedToTerms={setAgreedToTerms}
      />
    </form>
  );
};
