import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { User, UserX } from 'lucide-react';

interface AuthStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const AuthStatus = ({ showDetails = false, className = '' }: AuthStatusProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>
        <span className="text-sm text-gray-500">Checking auth...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <UserX className="h-4 w-4 text-gray-400" />
        <Badge variant="secondary" className="text-xs">
          Not signed in
        </Badge>
        {showDetails && (
          <span className="text-xs text-gray-500">
            Please sign in to access all features
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <User className="h-4 w-4 text-green-500" />
      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
        Signed in
      </Badge>
      {showDetails && (
        <span className="text-xs text-gray-500">
          {user.email}
        </span>
      )}
    </div>
  );
};
 