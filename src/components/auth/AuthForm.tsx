
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isBuilder, setIsBuilder] = useState(false);
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
        agreedToTerms
      );
    } else {
      setIsFormValid(email !== "" && password !== "");
    }
  }, [email, password, firstName, agreedToTerms, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!isFormValid) {
          setErrorMessage("Please fill in all fields and agree to the terms of service.");
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              user_type: isBuilder ? 'ai_builder' : 'ai_investor'
            },
          },
        });

        if (error) {
          console.error("Signup error:", error);
          if (error.message.includes("User already registered")) {
            setErrorMessage("This email is already registered. Please sign in instead.");
            setIsSignUp(false);
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("Sign in error:", error);
          setErrorMessage(error.message);
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.message?.includes("User already registered")) {
        setErrorMessage("This email is already registered. Please sign in instead.");
        setIsSignUp(false);
      } else {
        setErrorMessage(error.message || "An error occurred during authentication.");
      }
    } finally {
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
        />
      </div>
      
      {isSignUp && <UserTypeSelector isBuilder={isBuilder} setIsBuilder={setIsBuilder} />}

      {isSignUp && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="bg-white"
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
          }}
          className="text-primary hover:underline"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
};
