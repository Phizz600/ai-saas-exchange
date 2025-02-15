
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', session?.user?.id],
    enabled: !!session?.user?.id && requireAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', {
        user_id: session?.user?.id,
        requested_role: 'admin'
      });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate("/auth");
      } else if (requireAdmin && !isAdmin) {
        navigate("/marketplace");
      }
    }
  }, [session, isAdmin, isLoading, navigate, requireAdmin]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};
