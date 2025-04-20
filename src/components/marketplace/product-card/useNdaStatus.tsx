
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useNdaStatus(productId: string) {
  const [hasSigned, setHasSigned] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkNdaStatus = async () => {
      try {
        if (!productId) {
          if (isMounted) {
            setIsCheckingStatus(false);
          }
          return;
        }
        
        // First check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If no user is authenticated, they definitely haven't signed the NDA
          console.log('No authenticated user, NDA status: unsigned');
          if (isMounted) {
            setHasSigned(false);
            setIsCheckingStatus(false);
          }
          return;
        }
        
        // Check if the user has signed the NDA for this product
        const { data, error } = await supabase
          .from('product_ndas')
          .select('signed_at')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking NDA status:', error);
          if (isMounted) {
            setHasSigned(false);
            setIsCheckingStatus(false);
          }
        } else {
          if (isMounted) {
            setHasSigned(!!data);
            setIsCheckingStatus(false);
            console.log('User authenticated, NDA status:', !!data ? 'signed' : 'unsigned');
          }
        }
      } catch (err) {
        console.error('Error in NDA status check:', err);
        if (isMounted) {
          setHasSigned(false);
          setIsCheckingStatus(false);
        }
      }
    };
    
    checkNdaStatus();
    
    return () => {
      isMounted = false;
    };
  }, [productId]);
  
  return { hasSigned, isCheckingStatus, setHasSigned };
}
