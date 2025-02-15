import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log("AuthGuard: Checking session...");
    
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          console.log("AuthGuard: No session found, redirecting to auth");
          navigate("/auth");
        } else {
          console.log("AuthGuard: Session found", session.user.id);
          setSession(session);
        }
      } catch (error) {
        console.error("AuthGuard: Error checking auth status:", error);
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthGuard: Auth state changed:", event);
      
      if (event === "SIGNED_IN") {
        console.log("AuthGuard: User signed in");
        setSession(session);
      } else if (event === "SIGNED_OUT") {
        console.log("AuthGuard: User signed out, redirecting to auth");
        setSession(null);
        navigate("/auth");
      } else if (event === "USER_UPDATED") {
        console.log("AuthGuard: User updated");
        setSession(session);
      }
    });

    return () => {
      console.log("AuthGuard: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};