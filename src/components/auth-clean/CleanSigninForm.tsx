import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Loader2, Chrome, Asterisk, Linkedin } from 'lucide-react';
import { NewAuthService } from '@/services/newAuthService';

interface SigninFormProps {
  onSigninSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export const CleanSigninForm = ({ onSigninSuccess, onSwitchToSignup, onForgotPassword }: SigninFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
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
      console.log('CleanSigninForm: Starting signin process');
      
      const result = await NewAuthService.signIn({
        email: formData.email,
        password: formData.password,
      });

      console.log('CleanSigninForm: Signin successful', result);
      onSigninSuccess();

    } catch (error: any) {
      console.error('CleanSigninForm: Signin error:', error);
      setError(error.message || 'An error occurred during signin');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      await NewAuthService.signInWithGoogle();
    } catch (error: any) {
      console.error('CleanSigninForm: Google signin error:', error);
      setError(error.message || 'Google signin failed');
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedInSignin = async () => {
    setIsLinkedInLoading(true);
    setError('');

    try {
      await NewAuthService.signInWithLinkedIn();
    } catch (error: any) {
      console.error('CleanSigninForm: LinkedIn signin error:', error);
      setError(error.message || 'LinkedIn signin failed');
      setIsLinkedInLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

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
            disabled={loading || isGoogleLoading || isLinkedInLoading}
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
            disabled={loading || isGoogleLoading || isLinkedInLoading}
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

      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-gray-300 hover:text-white underline"
          disabled={loading || isGoogleLoading || isLinkedInLoading}
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-purple-500/30"
        disabled={loading || isGoogleLoading || isLinkedInLoading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In'
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
        onClick={handleGoogleSignin}
        disabled={loading || isGoogleLoading || isLinkedInLoading}
        className="w-full border-white/20 text-white bg-white/10 hover:bg-white/10 active:bg-white/10"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={handleLinkedInSignin}
        disabled={loading || isGoogleLoading || isLinkedInLoading}
        className="w-full border-white/20 text-white bg-white/10 hover:bg-white/10 active:bg-white/10"
      >
        {isLinkedInLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Linkedin className="mr-2 h-4 w-4" />
        )}
        {isLinkedInLoading ? 'Signing in...' : 'Sign in with LinkedIn'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sm text-gray-300 hover:text-white underline"
          disabled={loading || isGoogleLoading || isLinkedInLoading}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};