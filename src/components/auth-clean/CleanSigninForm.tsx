import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { NewAuthService } from '@/services/newAuthService';

interface SigninFormProps {
  onSigninSuccess: () => void;
  onSwitchToSignup: () => void;
}

export const CleanSigninForm = ({ onSigninSuccess, onSwitchToSignup }: SigninFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError('');

    try {
      await NewAuthService.signInWithGoogle();
    } catch (error: any) {
      console.error('CleanSigninForm: Google signin error:', error);
      setError(error.message || 'Google signin failed');
      setLoading(false);
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

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="john@example.com"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="Enter your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white py-3"
        disabled={loading}
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

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sm text-gray-300 hover:text-white underline"
          disabled={loading}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};