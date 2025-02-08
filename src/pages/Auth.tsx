
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isBuilder, setIsBuilder] = useState(false);

  useEffect(() => {
    console.log("Auth: Component mounted");
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Auth: User already logged in, redirecting to marketplace");
        navigate("/marketplace");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth: Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        console.log("Auth: User signed in, redirecting to marketplace");
        navigate("/marketplace");
      }
    });

    return () => {
      console.log("Auth: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isSignUp) {
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
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <AuthLayout>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        {isSignUp && (
          <>
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

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="userType" className="font-exo">I am a</Label>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${!isBuilder ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  Investor
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        id="userType"
                        checked={isBuilder}
                        onCheckedChange={setIsBuilder}
                        className="data-[state=checked]:bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white p-4 max-w-xs">
                      <p className="text-sm text-gray-600">
                        Choose how you'll use the marketplace:
                        <br />- As an Investor to buy AI products
                        <br />- As a Builder to sell AI products
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className={`text-sm ${isBuilder ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  Builder
                </span>
              </div>
            </div>
          </>
        )}

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

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <p className="text-center text-sm">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Auth;
