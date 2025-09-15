import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Database as DatabaseIcon,
  Key,
  Globe
} from "lucide-react";

export const AuthDebug = () => {
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@example.com',
    password: 'testpassword123'
  });

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    const info: any = {};

    // Check environment variables
    info.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    info.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing';
    info.hasUrl = !!info.supabaseUrl;
    info.hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Test database connection
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      info.dbConnection = error ? `Error: ${error.message}` : 'Connected';
      info.dbError = error;
    } catch (err) {
      info.dbConnection = `Exception: ${err}`;
      info.dbError = err;
    }

    // Test auth connection
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      info.authConnection = error ? `Error: ${error.message}` : 'Connected';
      info.authError = error;
      info.currentSession = session;
    } catch (err) {
      info.authConnection = `Exception: ${err}`;
      info.authError = err;
    }

    setDebugInfo(info);
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      console.log('Testing sign in with:', testCredentials);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testCredentials.email,
        password: testCredentials.password,
      });

      console.log('Sign in result:', { data, error });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Sign in successful!",
          description: `Welcome ${data.user?.email}`,
        });
      }

      // Refresh debug info
      await checkSupabaseConnection();
    } catch (err) {
      console.error('Sign in exception:', err);
      toast({
        variant: "destructive",
        title: "Exception occurred",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      console.log('Testing sign up with:', testCredentials);
      
      const { data, error } = await supabase.auth.signUp({
        email: testCredentials.email,
        password: testCredentials.password,
      });

      console.log('Sign up result:', { data, error });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Sign up successful!",
          description: data.user ? "Check your email to verify" : "User created",
        });
      }

      // Refresh debug info
      await checkSupabaseConnection();
    } catch (err) {
      console.error('Sign up exception:', err);
      toast({
        variant: "destructive",
        title: "Exception occurred",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "Successfully signed out",
      });
      await checkSupabaseConnection();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="h-5 w-5" />
              Supabase Authentication Debug
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Variables */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Environment Variables
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {debugInfo.hasUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">VITE_SUPABASE_URL</span>
                </div>
                <div className="flex items-center gap-2">
                  {debugInfo.hasKey ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">VITE_SUPABASE_ANON_KEY</span>
                </div>
              </div>
              {debugInfo.supabaseUrl && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  {debugInfo.supabaseUrl}
                </div>
              )}
            </div>

            {/* Connection Status */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Connection Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {debugInfo.dbConnection === 'Connected' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Database: {debugInfo.dbConnection}</span>
                </div>
                <div className="flex items-center gap-2">
                  {debugInfo.authConnection === 'Connected' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Auth: {debugInfo.authConnection}</span>
                </div>
              </div>
            </div>

            {/* Current Session */}
            {debugInfo.currentSession && (
              <div>
                <h3 className="font-semibold mb-3">Current Session</h3>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    User: {debugInfo.currentSession.user?.email}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Error Details */}
            {(debugInfo.dbError || debugInfo.authError) && (
              <div>
                <h3 className="font-semibold mb-3">Error Details</h3>
                {debugInfo.dbError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Database: {JSON.stringify(debugInfo.dbError)}
                    </AlertDescription>
                  </Alert>
                )}
                {debugInfo.authError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Auth: {JSON.stringify(debugInfo.authError)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Test Authentication */}
            <div>
              <h3 className="font-semibold mb-3">Test Authentication</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={testCredentials.email}
                      onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={testCredentials.password}
                      onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={testSignIn} disabled={loading}>
                    Test Sign In
                  </Button>
                  <Button onClick={testSignUp} disabled={loading} variant="outline">
                    Test Sign Up
                  </Button>
                  <Button onClick={testSignOut} disabled={loading} variant="secondary">
                    Sign Out
                  </Button>
                  <Button onClick={checkSupabaseConnection} variant="outline">
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
