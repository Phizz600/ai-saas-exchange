import { useAuth } from "@/contexts/CleanAuthContext";
// import { useAuthCheck } from "@/hooks/useNewAuth"; // Removed - no longer needed
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, User, Shield, Mail } from "lucide-react";

export const AuthTest = () => {
  const { user, session, loading, signOut } = useAuth();

  // Derived authentication state
  const isAuthenticated = !loading && !!user;
  const isUnauthenticated = !loading && !user;

  const handleTestRequireAuth = () => {
    // const isAuth = requireAuth(); // Removed - no longer needed
    // if (isAuth) {
      console.log("User is authenticated, proceeding...");
    // }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Test Page</h1>
          <p className="text-gray-600">Test and verify the authentication system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Status
              </CardTitle>
              <CardDescription>
                Current authentication state and user information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Loading:</span>
                <Badge variant={loading ? "destructive" : "default"}>
                  {loading ? "Yes" : "No"}
                </Badge>
              </div>

              {user && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">User ID:</span>
                    <span className="text-sm text-gray-600 font-mono">{user.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email Verified:</span>
                    <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                      {user.email_confirmed_at ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              )}

              {session && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Session Expires:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(session.expires_at! * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hook Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Hook Testing
              </CardTitle>
              <CardDescription>
                Test authentication hooks and utilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={handleTestRequireAuth}
                  variant="outline"
                  className="w-full"
                >
                  Test requireAuth Hook
                </Button>
                
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                  disabled={!isAuthenticated}
                >
                  Sign Out
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">isAuthenticated:</span>
                  <Badge variant={isAuthenticated ? "default" : "secondary"}>
                    {isAuthenticated.toString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">isUnauthenticated:</span>
                  <Badge variant={isUnauthenticated ? "default" : "secondary"}>
                    {isUnauthenticated.toString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Verification
              </CardTitle>
              <CardDescription>
                Email verification status and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email Confirmed At:</span>
                    <span className="text-sm text-gray-600">
                      {user.email_confirmed_at 
                        ? new Date(user.email_confirmed_at).toLocaleString()
                        : "Not confirmed"
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Last Sign In:</span>
                    <span className="text-sm text-gray-600">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "Never"
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Created At:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    No user data available
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Session Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Session Information
              </CardTitle>
              <CardDescription>
                Current session details and tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Access Token:</span>
                    <span className="text-xs text-gray-600 font-mono">
                      {session.access_token.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Refresh Token:</span>
                    <span className="text-xs text-gray-600 font-mono">
                      {session.refresh_token.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Token Type:</span>
                    <span className="text-sm text-gray-600">{session.token_type}</span>
                  </div>
                </div>
              ) : (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    No active session
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Test various authentication flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button 
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="w-full"
              >
                Go to Auth Page
              </Button>
              <Button 
                onClick={() => window.location.href = '/marketplace'}
                variant="outline"
                className="w-full"
                disabled={!isAuthenticated}
              >
                Test Protected Route
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};