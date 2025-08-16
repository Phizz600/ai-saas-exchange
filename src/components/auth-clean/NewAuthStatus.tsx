import { useAuth } from '@/contexts/CleanAuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const NewAuthStatus = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Welcome, {user.email}
        </span>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link to="/auth">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
    </div>
  );
};