import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/NewAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAdminCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this area",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          throw error;
        }

        const userIsAdmin = !!data;
        setIsAdmin(userIsAdmin);

        if (!userIsAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this area",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Admin check failed:', error);
        toast({
          title: "Error",
          description: "Failed to verify permissions",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate, toast]);

  return { isAdmin, loading: loading || authLoading };
};