import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Mail,
  User,
  Key,
  RefreshCw,
  ExternalLink
} from "lucide-react";

export const AuthTestComplete = () => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState({
    email: 'testuser123@gmail.com',
    password: 'testpassword123',
    loading: false,
    user: null as any,
    error: '',
    step: 'ready' as 'ready' | 'signup' | 'verify' | 'signin' | 'success'
  });

  useEffect(() => {
    checkCurrentAuth();
  }, []);

  const checkCurrentAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setAuthState(prev => ({ 
          ...prev, 
          user, 
          step: 'success',
          error: ''
        }));
      }
    } catch (err) {
      console.error('Auth check error:', err);
    }
  };

  const handleSignUp = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      console.log('Creating user account...');
      
      const { data, error } = await supabase.auth.signUp({
        email: authState.email,
        password: authState.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          step: 'verify',
          user: data.user,
          error: ''
        }));
        
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
    }
  };

  const handleSignIn = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      console.log('Signing in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authState.email,
        password: authState.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          step: 'success',
          user: data.user,
          error: ''
        }));
        
        toast({
          title: "Welcome back!",
          description: `Signed in as ${data.user.email}`,
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState(prev => ({ 
        ...prev, 
        user: null, 
        step: 'ready',
        error: ''
      }));
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: authState.email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Please check your email inbox.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: error.message,
      });
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'ready': return <User className="h-5 w-5" />;
      case 'signup': return <Key className="h-5 w-5" />;
      case 'verify': return <Mail className="h-5 w-5" />;
      case 'signin': return <CheckCircle className="h-5 w-5" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStepColor = (step: string) => {
    switch (step) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'verify': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStepIcon(authState.step)}
              Complete Authentication Test
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStepColor(authState.step)}>
                {authState.step.toUpperCase()}
              </Badge>
              {authState.user && (
                <Badge variant="outline">
                  {authState.user.email_confirmed_at ? 'Verified' : 'Unverified'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Current Status */}
            {authState.user && (
              <Alert>
                <User className="h-4 w-4" />
                <AlertDescription>
                  <strong>Current User:</strong> {authState.user.email}
                  <br />
                  <strong>Email Verified:</strong> {authState.user.email_confirmed_at ? 'Yes' : 'No'}
                  <br />
                  <strong>User ID:</strong> {authState.user.id}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {authState.error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{authState.error}</AlertDescription>
              </Alert>
            )}

            {/* Step Instructions */}
            {authState.step === 'ready' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 1:</strong> Create a new account or sign in with existing credentials.
                  <br />
                  <strong>Note:</strong> Email verification is required before you can sign in.
                </AlertDescription>
              </Alert>
            )}

            {authState.step === 'verify' && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 2:</strong> Check your email inbox for a verification link from Supabase.
                  <br />
                  <strong>Email:</strong> {authState.email}
                  <br />
                  Click the verification link, then return here to sign in.
                </AlertDescription>
              </Alert>
            )}

            {authState.step === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Success!</strong> You are now authenticated and can test the profile functionality.
                  <br />
                  Visit the Profile Real Test page to continue testing.
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            {authState.step !== 'success' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={authState.email}
                    onChange={(e) => setAuthState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="testuser123@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={authState.password}
                    onChange={(e) => setAuthState(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="testpassword123"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {authState.step === 'ready' && (
                <>
                  <Button 
                    onClick={handleSignUp} 
                    disabled={authState.loading}
                    className="flex-1"
                  >
                    {authState.loading ? "Creating..." : "Create Account"}
                  </Button>
                  <Button 
                    onClick={handleSignIn} 
                    disabled={authState.loading}
                    variant="outline"
                    className="flex-1"
                  >
                    {authState.loading ? "Signing in..." : "Sign In"}
                  </Button>
                </>
              )}

              {authState.step === 'verify' && (
                <>
                  <Button 
                    onClick={handleSignIn} 
                    disabled={authState.loading}
                    className="flex-1"
                  >
                    {authState.loading ? "Signing in..." : "Sign In (After Verification)"}
                  </Button>
                  <Button 
                    onClick={resendVerification} 
                    variant="outline"
                  >
                    Resend Email
                  </Button>
                </>
              )}

              {authState.step === 'success' && (
                <>
                  <Button 
                    onClick={() => window.open('/profile-real-test', '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Test Profile Page
                  </Button>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline"
                  >
                    Sign Out
                  </Button>
                </>
              )}

              <Button 
                onClick={checkCurrentAuth} 
                variant="secondary"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>For Testing:</strong></p>
              <p>• Use the provided test credentials or create your own</p>
              <p>• Email verification is required - check your inbox</p>
              <p>• Once verified, you can test the full profile functionality</p>
              <p>• Check browser console for detailed logs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
