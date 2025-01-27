import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-accent3 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <img 
            src="/lovable-uploads/b2726e08-98dd-472d-b44a-b780d6e1343e.png" 
            alt="AI Exchange Club Logo" 
            className="h-40 mx-auto mb-0"
          />
          <p className="text-gray-300">Please enter your details to continue</p>
        </div>
        <div className="bg-card rounded-lg shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
};