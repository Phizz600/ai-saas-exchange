
import { Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

// Error boundary fallback
const ErrorFallback = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 exo-2-heading">Something went wrong</h2>
        <p className="text-gray-600 mb-6">We're having trouble loading this page. Please try again or return to the home page.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6]">
            <RefreshCw size={16} />
            Refresh page
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home size={16} />
            Go to home
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loading indicator with brand colors
const LoadingIndicator = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
  </div>
);

export function RouteProvider() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>
        {routes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element}
            errorElement={<ErrorFallback />}
          />
        ))}
        {/* Catch-all route for 404 pages */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <h1 className="text-3xl font-bold mb-4 exo-2-heading">Coming Soon</h1>
              <p className="text-gray-600 mb-6">This feature is coming soon. Stay tuned for updates!</p>
              <Button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6]">
                Return to Home
              </Button>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
