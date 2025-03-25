
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { TestEmailSender } from "@/components/admin/TestEmailSender";
import { AuthGuard } from "@/components/AuthGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const Admin = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // In production, this page will be hidden by the AuthGuard
    // This is just an extra measure
    if (import.meta.env.PROD) {
      // In the future, we could check for admin role here
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="text-gray-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="exo-2-heading text-3xl font-bold mb-6">Admin Tools</h1>
            
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <InfoIcon className="h-5 w-5 text-blue-500" />
              <AlertDescription className="text-blue-700">
                This admin panel is accessible to authenticated users. In the future, we'll add role-based access control.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-6">
              <TestEmailSender />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Admin;
