import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { SignupForm } from './SignupForm';
import { SigninForm } from './SigninForm';
import { useAuth } from '@/contexts/NewAuthContext';

export const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      const redirectTo = location.state?.redirectTo || '/product-dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  const handleAuthSuccess = () => {
    const redirectTo = location.state?.redirectTo || '/product-dashboard';
    navigate(redirectTo, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <AuthLayout
      title={isSignup ? "Create Account" : "Welcome Back"}
      subtitle={isSignup ? "Join the AI Exchange Club" : "Sign in to your account"}
    >
      {isSignup ? (
        <SignupForm
          onSignupSuccess={handleAuthSuccess}
          onSwitchToSignin={() => setIsSignup(false)}
        />
      ) : (
        <SigninForm
          onSigninSuccess={handleAuthSuccess}
          onSwitchToSignup={() => setIsSignup(true)}
        />
      )}
    </AuthLayout>
  );
};