import React from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-['Exo_2']">
              {title}
            </h1>
            <p className="text-gray-300 text-sm">
              {subtitle}
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};