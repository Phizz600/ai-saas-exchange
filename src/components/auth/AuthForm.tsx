
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserTypeSelector } from "./UserTypeSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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
  const { toast } = useToast();

  // Get the current URL for use in the redirectTo
  const getRedirectUrl = () => {
    // Get the current origin (protocol + hostname + port)
    const origin = window.location.origin;
    return `${origin}/auth`;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
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

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage("");
      setIsGoogleLoading(true);
      
      console.log("AuthForm: Starting Google sign in process");
      
      // Get the redirect URL dynamically
      const redirectUrl = getRedirectUrl();
      console.log("AuthForm: Using redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
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
        setErrorMessage(error.message || "An error occurred during Google sign in.");
        setIsGoogleLoading(false);
        return;
      }
      
      // If successful, the page will redirect to Google
      console.log("AuthForm: Redirecting to Google for authentication");
      
    } catch (error: any) {
      console.error("AuthForm: Unexpected error during Google sign in:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {isSignUp && (
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="bg-white"
            disabled={isLoading || isGoogleLoading}
          />
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white"
          disabled={isLoading || isGoogleLoading}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white"
          disabled={isLoading || isGoogleLoading}
          minLength={6}
        />
      </div>
      
      {isSignUp && (
        <UserTypeSelector 
          isBuilder={isBuilder} 
          setIsBuilder={setIsBuilder}
          userType={userType}
          setUserType={setUserType}
        />
      )}

      {isSignUp && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="bg-white"
            disabled={isLoading || isGoogleLoading}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSignUp ? !isFormValid : false || isLoading || isGoogleLoading}
        className={cn(
          "w-full transition-all duration-300 text-white",
          (isSignUp && !isFormValid) || isLoading || isGoogleLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 shadow-lg hover:shadow-xl"
        )}
      >
        {isLoading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        variant="outline"
      >
        {isGoogleLoading ? (
          "Please wait..."
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </Button>

      <p className="text-center text-sm">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage("");
            setIsLoading(false);
          }}
          className="text-primary hover:underline"
          disabled={isLoading || isGoogleLoading}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
};
