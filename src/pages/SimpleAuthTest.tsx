import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SimpleAuthTest = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("testuser123@gmail.com");
  const [password, setPassword] = useState("testpassword123");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Attempting sign in...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in result:", { data, error });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
      } else {
        console.log("Sign in successful:", data);
        toast({
          title: "Success!",
          description: `Welcome ${data.user?.email}`,
        });
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      toast({
        variant: "destructive",
        title: "Exception",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      console.log("Attempting sign up...");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("Sign up result:", { data, error });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
      } else {
        console.log("Sign up successful:", data);
        toast({
          title: "Success!",
          description: data.user ? "Check your email to verify" : "User created",
        });
      }
    } catch (err) {
      console.error("Sign up exception:", err);
      toast({
        variant: "destructive",
        title: "Exception",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Auth Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="testuser123@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="testpassword123"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSignIn} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
            <Button 
              onClick={handleSignUp} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Check browser console for detailed logs
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
