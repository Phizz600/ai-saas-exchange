
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useNdaStatus(productId: string) {
  const [hasSigned, setHasSigned] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  useEffect(() => {
    const checkNdaStatus = async () => {
      try {
        // First check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // If no user is authenticated, they definitely haven't signed the NDA
          console.log('No authenticated user, NDA status: unsigned');
          setHasSigned(false);
          setIsCheckingStatus(false);
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
          setHasSigned(false);
        } else {
          setHasSigned(!!data);
          console.log('User authenticated, NDA status:', !!data ? 'signed' : 'unsigned');
        }
      } catch (err) {
        console.error('Error in NDA status check:', err);
        setHasSigned(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    if (productId) {
      checkNdaStatus();
    }
  }, [productId]);
  
  return { hasSigned, isCheckingStatus, setHasSigned };
}
