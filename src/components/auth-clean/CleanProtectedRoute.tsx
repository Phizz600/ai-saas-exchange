import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/CleanAuthContext';

interface CleanProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const CleanProtectedRoute = ({ children, requireAuth = true }: CleanProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (loading) return; // Wait for auth to initialize

    if (requireAuth && !user) {
      // User needs to be authenticated but isn't
      navigate('/auth', {
        state: { redirectTo: location.pathname },
        replace: true,
      });
    } else if (!requireAuth && user) {
      // Check if this is a password recovery flow - don't redirect in that case
      const type = searchParams.get('type');
      const isPasswordRecovery = type === 'recovery';
      
      if (!isPasswordRecovery) {
        // User is authenticated but this is an auth-only route (like login page)
        const redirectTo = location.state?.redirectTo || '/product-dashboard';
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, loading, requireAuth, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // For auth pages, show content if user is not authenticated OR if it's a password recovery flow
  if (!requireAuth) {
    const type = searchParams.get('type');
    const isPasswordRecovery = type === 'recovery';
    return (user && !isPasswordRecovery) ? null : <>{children}</>;
  }

  // For protected pages, show content if user is authenticated
  return user ? <>{children}</> : null;
};