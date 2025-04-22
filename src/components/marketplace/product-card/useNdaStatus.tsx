
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useNdaStatus(productId: string) {
  const [hasSigned, setHasSigned] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const checkNdaStatus = async () => {
      try {
        setIsCheckingStatus(true);
        
        // First, check if product requires NDA
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('requires_nda')
          .eq('id', productId)
          .single();
          
        if (productError) {
          console.error("Error checking product NDA requirements:", productError);
          return;
        }
        
        // If product doesn't require NDA, no need to check NDA status
        if (!product?.requires_nda) {
          if (mounted) {
            setHasSigned(true); // Effectively "signed" if not required
            setIsCheckingStatus(false);
          }
          return;
        }
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (mounted) {
            setHasSigned(false);
            setIsCheckingStatus(false);
          }
          return;
        }
        
        // Check if user has already signed NDA for this product
        const { data: nda, error: ndaError } = await supabase
          .from('product_ndas')
          .select('signed_at')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (ndaError) {
          console.error("Error checking NDA status:", ndaError);
          if (mounted) {
            toast({
              title: "Error",
              description: "Could not verify NDA status. Please try again.",
              variant: "destructive",
            });
          }
        }
        
        if (mounted) {
          setHasSigned(!!nda);
          setSignedAt(nda?.signed_at || null);
          setIsCheckingStatus(false);
        }
      } catch (error) {
        console.error("Error in NDA status check:", error);
        if (mounted) {
          setIsCheckingStatus(false);
        }
      }
    };
    
    if (productId) {
      checkNdaStatus();
    }
    
    return () => {
      mounted = false;
    };
  }, [productId, toast]);
  
  return { hasSigned, setHasSigned, isCheckingStatus, signedAt };
}
