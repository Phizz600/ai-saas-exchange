
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AuthButtonsProps {
  isSignUp: boolean;
  isFormValid: boolean;
  isLoading: boolean;
  isGoogleLoading: boolean;
  setIsSignUp: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  handleGoogleSignIn: () => void;
  setIsLoading: (value: boolean) => void;
}

export const AuthButtons = ({
  isSignUp,
  isFormValid,
  isLoading,
  isGoogleLoading,
  setIsSignUp,
  setErrorMessage,
  handleGoogleSignIn,
  setIsLoading
}: AuthButtonsProps) => {
  return <>
      <Button 
        type="submit" 
        disabled={isSignUp ? !isFormValid : false || isLoading || isGoogleLoading} 
        className={cn(
          "w-full transition-all duration-300 font-medium shadow-md", 
          isSignUp && !isFormValid || isLoading || isGoogleLoading 
            ? "bg-gray-400/50 cursor-not-allowed text-white/70" 
            : "bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:shadow-lg hover:shadow-purple-500/30 text-white overflow-hidden relative after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-[#8B5CF6] after:via-[#0EA4E9] after:to-[#D946EE] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500"
        )}>
        {isLoading ? <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </span> : isSignUp ? "Sign Up" : "Sign In"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          
        </div>
        
      </div>

      <p className="text-center text-sm text-white/80">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button type="button" onClick={() => {
        setIsSignUp(!isSignUp);
        setErrorMessage("");
        setIsLoading(false);
      }} className="text-[#D946EE] hover:text-[#8B5CF6] transition-colors font-medium hover:underline focus:outline-none" disabled={isLoading || isGoogleLoading}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </>;
};
