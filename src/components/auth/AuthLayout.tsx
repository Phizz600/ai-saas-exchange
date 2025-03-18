
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export function AuthLayout({ children, title, subtitle, showBackButton = false }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {showBackButton && (
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="exo-2-header text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
            </div>
            
            <div className="auth-container">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
