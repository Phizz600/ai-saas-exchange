import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-accent3 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to AI Exchange</h1>
          <p className="text-gray-300">Sign in or create an account to continue</p>
        </div>
        <div className="bg-card rounded-lg shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
};