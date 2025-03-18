
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TermsCheckbox } from "./TermsCheckbox";
import { ErrorMessage } from "./ErrorMessage";

interface FormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (confirmPassword: string) => void;
  name?: string;
  setName?: (name: string) => void;
  isSignUp?: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  errorMessage: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  forgotPassword?: () => void;
}

export function FormFields({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  isSignUp = false,
  agreedToTerms,
  setAgreedToTerms,
  errorMessage,
  isLoading,
  onSubmit,
  forgotPassword,
}: FormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignUp && setName && (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="auth-input"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          className="auth-input"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          {!isSignUp && forgotPassword && (
            <button
              type="button"
              onClick={forgotPassword}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignUp ? "Create a password" : "Your password"}
          required
          className="auth-input"
        />
      </div>

      {isSignUp && setConfirmPassword && (
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword || ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            className="auth-input"
          />
        </div>
      )}

      {isSignUp && (
        <TermsCheckbox checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
      )}

      <ErrorMessage message={errorMessage} />

      <Button
        type="submit"
        disabled={isLoading || (isSignUp && !agreedToTerms)}
        className="w-full auth-button bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#C935DD] hover:to-[#7A4BE5]"
      >
        {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
      </Button>
    </form>
  );
}
