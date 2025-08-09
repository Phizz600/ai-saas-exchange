import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { UserTypeSelector } from "./UserTypeSelector";
import { ErrorMessage } from "./ErrorMessage";
import { NameField, LastNameField, EmailField, PasswordField, ConfirmPasswordField } from "./FormFields";
import { TermsCheckbox } from "./TermsCheckbox";
import { AuthButtons } from "./AuthButtons";
import { PasswordResetForm } from "./PasswordResetForm";
import { handleAuthSubmit } from "./utils/signup-helpers";
import { handleGoogleSignIn } from "./utils/signin-helpers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, CheckCircle, Lock } from "lucide-react";

interface AuthFormProps {
  onModeChange?: (isSignUp: boolean) => void;
}

export const AuthForm = ({ onModeChange }: AuthFormProps = {}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isBuilder, setIsBuilder] = useState(false);
  const [userType, setUserType] = useState<'ai_builder' | 'ai_investor'>('ai_investor');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);
  const [showAccountExistsAlert, setShowAccountExistsAlert] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isSignUp) {
      setIsFormValid(
        email !== "" &&
        password !== "" &&
        firstName !== "" &&
        lastName !== "" &&
        confirmPassword !== "" &&
        confirmPassword === password &&
        agreedToTerms &&
        ['ai_builder', 'ai_investor'].includes(userType)
      );
    } else {
      setIsFormValid(email !== "" && password !== "");
    }
    
    // Clear signup success message when user starts typing again
    if (signupSuccess && (email !== "" || password !== "" || firstName !== "" || lastName !== "")) {
      setSignupSuccess(false);
    }
  }, [email, password, firstName, lastName, confirmPassword, agreedToTerms, isSignUp, userType, signupSuccess]);

  // Notify parent component when mode changes
  useEffect(() => {
    onModeChange?.(isSignUp && !showPasswordReset);
  }, [isSignUp, showPasswordReset, onModeChange]);

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
    
    // Custom callback to handle successful signup
    const handleSignupSuccess = () => {
      setSignupSuccess(true);
      // Clear form fields after successful signup
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setSubscribeNewsletter(false);
      setAgreedToTerms(false);
      setShowVerificationInfo(false);
    };
    
    await handleAuthSubmit(
      isSignUp,
      isFormValid,
      email,
      password,
      firstName,
      userType,
      lastName,
      subscribeNewsletter,
      setErrorMessage,
      setIsLoading,
      (newIsSignUp: boolean) => {
        setIsSignUp(newIsSignUp);
        // If switching from signup to signin, show the account exists alert
        if (!newIsSignUp && isSignUp) {
          setShowAccountExistsAlert(true);
          // Clear the alert after 8 seconds
          setTimeout(() => setShowAccountExistsAlert(false), 8000);
          // Clear the form fields when switching to signin
          setFirstName("");
          setAgreedToTerms(false);
          // Clear any existing error messages
          setErrorMessage("");
          // Hide verification info when switching to signin
          setShowVerificationInfo(false);
          // Hide signup success message
          setSignupSuccess(false);
        }
      },
      toast,
      handleSignupSuccess
    );
  };

  const handleGoogleSignInClick = async () => {
    await handleGoogleSignIn(setErrorMessage, setIsGoogleLoading);
  };

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  const handleBackToAuth = () => {
    setShowPasswordReset(false);
    setErrorMessage("");
  };

  // If showing password reset form
  if (showPasswordReset) {
    return <PasswordResetForm onBack={handleBackToAuth} />;
  }

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
        <Alert className="mb-4 bg-blue-50/90 backdrop-blur-sm border border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
          <AlertDescription className="font-medium text-blue-700">
            <strong>Account found!</strong> Please sign in with your existing account below.
          </AlertDescription>
        </Alert>
      )}

      {signupSuccess && (
        <Alert className="mb-6 bg-green-50/95 backdrop-blur-sm border-2 border-green-300 shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <AlertDescription className="font-medium text-green-800">
            <div className="space-y-2">
              <div className="text-lg font-semibold">Account Created Successfully! 🎉</div>
              <div className="text-sm">
                📧 <strong>Check your email inbox</strong> for a verification link from Supabase
              </div>
              <div className="text-sm text-green-600">
                ✅ Once verified, you can sign in to access your account
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isSignUp && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NameField 
            firstName={firstName} 
            setFirstName={setFirstName}
            isLoading={isLoading}
            isGoogleLoading={isGoogleLoading}
          />
          <LastNameField 
            lastName={lastName}
            setLastName={setLastName}
            isLoading={isLoading}
            isGoogleLoading={isGoogleLoading}
          />
        </div>
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
        <>
          <div className="mt-4">
            <ConfirmPasswordField 
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isLoading={isLoading}
              isGoogleLoading={isGoogleLoading}
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                disabled={isLoading || isGoogleLoading}
                className="border-white/30 data-[state=checked]:bg-[#D946EE] data-[state=checked]:border-[#D946EE]"
              />
              <label htmlFor="rememberMe" className="text-sm text-white/90 cursor-pointer">
                Remember me
              </label>
            </div>
          </div>
          <Separator className="my-6" />
        </>
      )}
      
      {isSignUp && (
        <UserTypeSelector 
          isBuilder={isBuilder} 
          setIsBuilder={setIsBuilder}
          userType={userType}
          setUserType={setUserType}
        />
      )}

      {isSignUp && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="subscribeNewsletter" 
              checked={subscribeNewsletter}
              onCheckedChange={(checked) => setSubscribeNewsletter(Boolean(checked))}
              disabled={isLoading || isGoogleLoading}
              className="border-white/30 data-[state=checked]:bg-[#D946EE] data-[state=checked]:border-[#D946EE]"
            />
            <label htmlFor="subscribeNewsletter" className="text-sm text-white/90 cursor-pointer">
              Subscribe to our weekly newsletter
            </label>
          </div>
          <TermsCheckbox 
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
            isLoading={isLoading}
            isGoogleLoading={isGoogleLoading}
          />
        </>
      )}

      {!isSignUp && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-[#D946EE] hover:text-[#8B5CF6] underline"
            disabled={isLoading || isGoogleLoading}
          >
            <Lock className="h-4 w-4 inline mr-1" />
            Forgot your password?
          </button>
        </div>
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
        onModeToggle={() => {
          setSignupSuccess(false);
          setShowAccountExistsAlert(false);
          setShowVerificationInfo(false);
        }}
      />
    </form>
  );
};
