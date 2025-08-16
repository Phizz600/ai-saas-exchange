import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Mail, Lock, Loader2, Asterisk, Chrome } from 'lucide-react';
import { NewAuthService, UserType } from '@/services/newAuthService';
import { Switch } from '@/components/ui/switch';
import { EmailVerificationReminder } from './EmailVerificationReminder';

interface SignupFormProps {
  onSignupSuccess: () => void;
  onSwitchToSignin: () => void;
}

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
  onResend: () => void;
}

export const CleanSignupForm = ({ onSignupSuccess, onSwitchToSignin }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'ai_investor' as UserType,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleUserTypeChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      userType: checked ? 'ai_builder' : 'ai_investor'
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('CleanSignupForm: Starting signup process');
      
      const result = await NewAuthService.signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
      });

      console.log('CleanSignupForm: Signup successful', result);

      if (result.needsEmailVerification) {
        setError('');
        setUserEmail(formData.email);
        setEmailVerificationSent(true);
      } else {
        onSignupSuccess();
      }

    } catch (error: any) {
      console.error('CleanSignupForm: Signup error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      await NewAuthService.signInWithGoogle();
    } catch (error: any) {
      console.error('CleanSignupForm: Google signup error:', error);
      setError(error.message || 'Google signup failed');
      setIsGoogleLoading(false);
    }
  };

  const handleResendVerification = async () => {
    // Implementation would depend on Supabase resend functionality
    console.log('Resending verification email to:', userEmail);
  };

  if (emailVerificationSent) {
    return <EmailVerificationReminder email={userEmail} onBack={() => setEmailVerificationSent(false)} onResend={handleResendVerification} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="text-left">
          <div className="flex items-center gap-1 mb-2">
            <Label htmlFor="firstName" className="text-left text-white text-base">First Name</Label>
            <Asterisk className="h-3 w-3 text-red-500" />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="pl-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
              placeholder="Enter your first name"
              disabled={loading || isGoogleLoading}
            />
          </div>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1 mb-2">
            <Label htmlFor="lastName" className="text-left text-white text-base">Last Name</Label>
            <Asterisk className="h-3 w-3 text-red-500" />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="pl-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
              placeholder="Enter your last name"
              disabled={loading || isGoogleLoading}
            />
          </div>
        </div>
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1 mb-2">
          <Label htmlFor="email" className="text-left text-white text-base">Email</Label>
          <Asterisk className="h-3 w-3 text-red-500" />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
            placeholder="Enter your email"
            disabled={loading || isGoogleLoading}
          />
        </div>
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1 mb-2">
          <Label htmlFor="password" className="text-left text-white text-base">Password</Label>
          <Asterisk className="h-3 w-3 text-red-500" />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
            placeholder="Enter your password"
            disabled={loading || isGoogleLoading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1 mb-2">
          <Label htmlFor="confirmPassword" className="text-left text-white text-base">Confirm Password</Label>
          <Asterisk className="h-3 w-3 text-red-500" />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="pl-10 pr-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
            placeholder="Confirm your password"
            disabled={loading || isGoogleLoading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Account Type</Label>
        <div className="flex items-center space-x-3">
          <span className="text-gray-300">Investor</span>
          <Switch
            checked={formData.userType === 'ai_builder'}
            onCheckedChange={handleUserTypeChange}
            disabled={loading}
          />
          <span className="text-gray-300">Builder</span>
        </div>
        <p className="text-xs text-gray-400">
          {formData.userType === 'ai_builder' 
            ? 'I want to sell AI products' 
            : 'I want to invest in AI products'
          }
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-purple-500/30"
        disabled={loading || isGoogleLoading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-2 text-white/60">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        disabled={loading || isGoogleLoading}
        className="w-full border-white/20 text-white bg-white/10 hover:bg-white/10 active:bg-white/10"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignin}
          className="text-sm text-gray-300 hover:text-white underline"
          disabled={loading || isGoogleLoading}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};