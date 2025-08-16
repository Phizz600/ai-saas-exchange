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
        <div className="mb-6 text-center">
          <img 
            src="/lovable-uploads/ebacde2f-54c1-4944-b6d5-e1557dc47078.png" 
            alt="AI Exchange Club Logo" 
            className="h-16 mx-auto mb-4" 
          />
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,70,238,0.3)] hover:border-white/20">
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