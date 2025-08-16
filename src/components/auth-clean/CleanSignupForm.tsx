import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';
import { NewAuthService, UserType } from '@/services/newAuthService';
import { Switch } from '@/components/ui/switch';

interface SignupFormProps {
  onSignupSuccess: () => void;
  onSwitchToSignin: () => void;
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
  const [error, setError] = useState('');

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
        alert('Please check your email to verify your account before signing in.');
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
    setLoading(true);
    setError('');

    try {
      await NewAuthService.signInWithGoogle();
    } catch (error: any) {
      console.error('CleanSignupForm: Google signup error:', error);
      setError(error.message || 'Google signup failed');
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">
            First Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
              placeholder="John"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">
            Last Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
              placeholder="Doe"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email Address *
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
          Password *
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Confirm Password *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="Confirm your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
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
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white py-3"
        disabled={loading}
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

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignin}
          className="text-sm text-gray-300 hover:text-white underline"
          disabled={loading}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};