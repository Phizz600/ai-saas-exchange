
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

        console.log("AuthForm: Signup successful:", data);
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      } else {
        console.log("AuthForm: Starting signin process");
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("AuthForm: Sign in error:", error);
          if (error.message.includes("Invalid login credentials")) {
            setErrorMessage("Invalid email or password.");
          } else {
            setErrorMessage(error.message);
          }
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
            disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            disabled={isLoading}
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
        disabled={isSignUp ? !isFormValid : false || isLoading}
        className={cn(
          "w-full transition-all duration-300 text-white",
          (isSignUp && !isFormValid) || isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 shadow-lg hover:shadow-xl"
        )}
      >
        {isLoading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
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
          disabled={isLoading}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
};
