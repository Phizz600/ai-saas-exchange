import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { CleanSignupForm } from './CleanSignupForm';
import { CleanSigninForm } from './CleanSigninForm';
import { PasswordResetForm } from './PasswordResetForm';
import { NewPasswordForm } from '../auth/NewPasswordForm';
import { useAuth } from '@/contexts/CleanAuthContext';

export const CleanAuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  // Check if this is a password recovery flow
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setShowNewPassword(true);
    }
  }, [searchParams]);

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

  const handleNewPasswordSuccess = () => {
    navigate('/product-dashboard', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show new password form for recovery flow
  if (showNewPassword) {
    return (
      <AuthLayout
        title="Set New Password"
        subtitle="Enter your new password"
      >
        <NewPasswordForm onSuccess={handleNewPasswordSuccess} />
      </AuthLayout>
    );
  }

  // Show password reset form
  if (showPasswordReset) {
    return (
      <AuthLayout
        title="Reset Password"
        subtitle="We'll send you a reset link"
      >
        <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={isSignup ? "Create Account" : "Welcome Back"}
      subtitle={isSignup ? "Join the AI Exchange Club" : "Sign in to your account"}
    >
      {isSignup ? (
        <CleanSignupForm
          onSignupSuccess={handleAuthSuccess}
          onSwitchToSignin={() => setIsSignup(false)}
        />
      ) : (
        <CleanSigninForm
          onSigninSuccess={handleAuthSuccess}
          onSwitchToSignup={() => setIsSignup(true)}
          onForgotPassword={() => setShowPasswordReset(true)}
        />
      )}
    </AuthLayout>
  );
};