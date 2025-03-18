import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { FormFields } from "./FormFields";
import { AuthButtons } from "./AuthButtons";
import { UserTypeSelection } from "./UserTypeSelection";
import { handleGoogleSignIn } from "./utils/signin-helpers";
import { handleSignUp, handleEmailSignUp } from "./utils/signup-helpers";
import { handlePasswordReset } from "./utils/password-helpers";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [userType, setUserType] = useState("user");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for reset password token in URL
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const type = params.get('type');

    if (accessToken && type === 'recovery') {
      setIsResetPassword(true);
    }
  }, [location.search]);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage("");
  };

  const handleGoogleAuth = async () => {
    await handleGoogleSignIn(setErrorMessage, setIsGoogleLoading);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isSignUp) {
      if (!name) {
        setErrorMessage("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      await handleSignUp(email, password, name, userType, agreedToTerms, setErrorMessage, setIsLoading, navigate);
    } else {
      await handleEmailSignUp(email, password, setErrorMessage, setIsLoading, navigate);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePasswordReset(email, setErrorMessage, setIsLoading, setResetEmailSent);
  };

  return (
    <div className="w-full">
      <AuthLayout 
        title={isSignUp ? "Create an Account" : (isResetPassword ? "Reset Password" : "Welcome Back")}
        subtitle={isSignUp ? "Join our community of AI experts and enthusiasts" : (isResetPassword ? "Enter your email to reset your password" : "Sign in to your account")}
      >
        <div className="space-y-6">
          {!isResetPassword ? (
            <>
              {isSignUp && (
                <UserTypeSelection
                  selectedType={userType}
                  onChange={setUserType}
                />
              )}
              
              <FormFields
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                isSignUp={isSignUp}
                agreedToTerms={agreedToTerms}
                setAgreedToTerms={setAgreedToTerms}
                errorMessage={errorMessage}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                forgotPassword={() => setIsResetPassword(true)}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <AuthButtons
                isGoogleLoading={isGoogleLoading}
                onGoogleSignIn={handleGoogleAuth}
              />
              
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {!resetEmailSent ? (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="auth-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="text-sm text-red-600">{errorMessage}</div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full auth-button bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#C935DD] hover:to-[#7A4BE5] px-4 py-2 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? "Processing..." : "Send Reset Link"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-4 text-green-600">
                    Password reset email sent! Check your inbox.
                  </div>
                </div>
              )}
              
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPassword(false);
                    setResetEmailSent(false);
                    setErrorMessage("");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </AuthLayout>
    </div>
  );
}
