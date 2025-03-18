
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
  return (
    <>
      <Button 
        type="submit" 
        disabled={isSignUp ? !isFormValid : false || isLoading || isGoogleLoading}
        className={cn(
          "w-full transition-all duration-300 font-medium",
          (isSignUp && !isFormValid) || isLoading || isGoogleLoading
            ? "bg-gray-400/50 cursor-not-allowed text-white/70"
            : "bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:shadow-lg hover:shadow-purple-500/30 text-white overflow-hidden relative after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-[#8B5CF6] after:via-[#0EA4E9] after:to-[#D946EE] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </span>
        ) : (
          isSignUp ? "Sign Up" : "Sign In"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full bg-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-white/70">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
        className="w-full flex items-center justify-center bg-white/90 hover:bg-white text-gray-700 border-0 transition-all duration-300 hover:shadow-lg"
        variant="outline"
      >
        {isGoogleLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </span>
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

      <p className="text-center text-sm text-white/80">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage("");
            setIsLoading(false);
          }}
          className="text-[#D946EE] hover:text-[#8B5CF6] transition-colors font-medium hover:underline focus:outline-none"
          disabled={isLoading || isGoogleLoading}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </>
  );
};
