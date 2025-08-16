import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle, Asterisk } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordResetFormProps {
  onBack: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[Auth] Attempting password reset for:', email);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      console.log('[Auth] Password reset response:', { resetError });

      if (resetError) {
        setError(resetError.message);
      } else {
        setEmailSent(true);
      }
    } catch (error: any) {
      console.error('[Auth] Unexpected error during password reset:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-['Exo_2']">
            Check Your Email
          </h2>
          <p className="text-white/80 mb-6">
            We've sent a password reset link to <strong className="text-white">{email}</strong>
          </p>
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Mail className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <div className="space-y-2">
                <div><strong>Next steps:</strong></div>
                <div>1. Check your email for a message from Supabase</div>
                <div>2. Click the "Reset Password" link in the email</div>
                <div>3. You'll be redirected back here to set your new password</div>
                <div className="text-sm mt-2 text-blue-300">
                  💡 If you don't see the email, check your spam folder. The link expires in 1 hour.
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-white/20 text-white bg-white/10 hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 font-['Exo_2']">
          Reset Your Password
        </h2>
        <p className="text-white/80">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-left">
          <div className="flex items-center gap-1 mb-2">
            <Label htmlFor="email" className="text-left text-white text-base">Email Address</Label>
            <Asterisk className="h-3 w-3 text-red-500" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isLoading}
              required
              className="pl-10 bg-black/30 text-white border-white/40 focus:border-[#D946EE] placeholder:text-white/60 shadow-inner"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-purple-500/30"
          disabled={isLoading || !email}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full border-white/20 text-white bg-white/10 hover:bg-white/20"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </form>
    </div>
  );
};