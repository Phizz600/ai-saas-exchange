import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Save the current location to redirect back after login
        const currentPath = location.pathname + location.search;
        navigate(redirectTo, { 
          state: { 
            redirectTo: currentPath,
            message: 'Please sign in to access this page'
          } 
        });
      } else if (!requireAuth && user) {
        // If user is authenticated and this route doesn't require auth (like login page)
        // Redirect to dashboard or home
        navigate('/product-dashboard');
      }
    }
  }, [user, loading, requireAuth, navigate, location, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect in useEffect
  }

  if (!requireAuth && user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
 