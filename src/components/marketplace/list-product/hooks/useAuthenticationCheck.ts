
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthenticationCheck = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  const navigate = useNavigate();

  const checkAuthentication = async (): Promise<boolean> => {
    setIsAuthChecking(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        toast.error("Authentication Error", {
          description: "Please sign in to submit your product"
        });
        return false;
      }
      
      if (!sessionData.session) {
        toast.error("Authentication Required", {
          description: "Please sign in to submit your product",
          action: {
            label: "Sign In",
            onClick: () => navigate("/auth?redirect=/list-product")
          }
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    } finally {
      setIsAuthChecking(false);
    }
  };

  return {
    isAuthChecking,
    checkAuthentication
  };
};
