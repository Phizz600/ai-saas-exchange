import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UseAuthCheckOptions {
  redirectTo?: string;
  showToast?: boolean;
  message?: string;
}

export const useAuthCheck = (options: UseAuthCheckOptions = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    redirectTo = '/auth',
    showToast = true,
    message = 'Please sign in to access this feature'
  } = options;

  const requireAuth = () => {
    if (loading) return false;
    
    if (!user) {
      if (showToast) {
        toast({
          title: "Authentication Required",
          description: message,
          variant: "default",
        });
      }
      
      navigate(redirectTo, {
        state: {
          redirectTo: window.location.pathname,
          message
        }
      });
      return false;
    }
    
    return true;
  };

  const isAuthenticated = !loading && !!user;
  const isUnauthenticated = !loading && !user;

  return {
    user,
    loading,
    isAuthenticated,
    isUnauthenticated,
    requireAuth
  };
};