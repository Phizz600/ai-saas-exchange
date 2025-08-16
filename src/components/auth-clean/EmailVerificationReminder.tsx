import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface EmailVerificationReminderProps {
  email: string;
  onBack: () => void;
  onResend: () => void;
}

export const EmailVerificationReminder = ({ email, onBack, onResend }: EmailVerificationReminderProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-['Exo_2']">
          Check Your Email
        </h2>
        <p className="text-white/80 mb-6">
          We've sent a verification link to <strong className="text-white">{email}</strong>
        </p>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20">
        <CheckCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <div className="space-y-2">
            <div><strong>Next steps:</strong></div>
            <div>1. Check your email inbox (and spam folder)</div>
            <div>2. Click the verification link in the email</div>
            <div>3. Return here to sign in to your account</div>
            <div className="text-sm mt-2 text-blue-300">
              💡 The verification link expires in 24 hours
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Button
          onClick={onResend}
          variant="outline"
          className="w-full border-white/20 text-white bg-white/10 hover:bg-white/20"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Resend Verification Email
        </Button>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-white/20 text-white bg-white/10 hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign Up
        </Button>
      </div>
    </div>
  );
};