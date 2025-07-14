import { useAuth } from '@/contexts/AuthContext';
import { AuthStatus } from '@/components/AuthStatus';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, UserX, Shield, Lock } from 'lucide-react';

export const AuthTest = () => {
  const { user, session, loading, signOut } = useAuth();
  const { isAuthenticated, isUnauthenticated, requireAuth } = useAuthCheck();

  const handleTestAuth = () => {
    const result = requireAuth();
    console.log('Auth check result:', result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Authentication Test Page</h1>
          <p className="text-white/80">This page helps you verify that authentication is working correctly.</p>
        </div>

        {/* Current Auth Status */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Authentication Status
            </CardTitle>
            <CardDescription className="text-white/70">
              Real-time authentication state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Loading State:</span>
              <Badge variant={loading ? "destructive" : "default"}>
                {loading ? "Loading..." : "Ready"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">User Status:</span>
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <User className="h-4 w-4 text-green-500" />
                    <Badge className="bg-green-100 text-green-800">Authenticated</Badge>
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 text-red-500" />
                    <Badge variant="destructive">Not Authenticated</Badge>
                  </>
                )}
              </div>
            </div>

            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-white">User Email:</span>
                  <span className="text-white/80">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">User ID:</span>
                  <span className="text-white/80 font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Session Active:</span>
                  <Badge variant={session ? "default" : "destructive"}>
                    {session ? "Yes" : "No"}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Auth Status Component */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              AuthStatus Component
            </CardTitle>
            <CardDescription className="text-white/70">
              Using the AuthStatus component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthStatus showDetails={true} />
          </CardContent>
        </Card>

        {/* Auth Check Hook */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">useAuthCheck Hook</CardTitle>
            <CardDescription className="text-white/70">
              Testing the authentication check hook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">isAuthenticated:</span>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "True" : "False"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">isUnauthenticated:</span>
              <Badge variant={isUnauthenticated ? "default" : "secondary"}>
                {isUnauthenticated ? "True" : "False"}
              </Badge>
            </div>
            <Button onClick={handleTestAuth} className="w-full">
              Test requireAuth()
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
            <CardDescription className="text-white/70">
              Test authentication actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <Button onClick={signOut} variant="destructive" className="w-full">
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/auth'} 
                className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6]"
              >
                Sign In
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Session Debug */}
        {session && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Session Debug</CardTitle>
              <CardDescription className="text-white/70">
                Current session information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-white/80 bg-black/20 p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 