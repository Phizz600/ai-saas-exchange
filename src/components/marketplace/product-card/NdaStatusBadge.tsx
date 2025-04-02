
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { LockIcon, UnlockIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NdaStatusBadgeProps {
  productId: string;
  className?: string;
  showTimestamp?: boolean;
}

export function NdaStatusBadge({ productId, className = "", showTimestamp = false }: NdaStatusBadgeProps) {
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkNdaStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // Get NDA status
        const { data, error } = await supabase
          .from('product_ndas')
          .select('signed_at')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching NDA status:', error);
        } else if (data) {
          setSignedAt(data.signed_at);
        }
      } catch (err) {
        console.error('Error checking NDA status:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      checkNdaStatus();
    }
  }, [productId]);

  if (isLoading || !signedAt) return null;

  return (
    <div className={`${className} flex items-center gap-2`}>
      <Badge 
        variant="outline" 
        className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-0 font-medium text-xs shadow-sm flex items-center"
      >
        <UnlockIcon className="h-3 w-3 mr-1" />
        NDA Signed
      </Badge>
      
      {showTimestamp && signedAt && (
        <Badge
          variant="outline"
          className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border-0 font-medium text-xs shadow-sm flex items-center"
        >
          <Clock className="h-3 w-3 mr-1" />
          {format(new Date(signedAt), "MMM d, yyyy")}
        </Badge>
      )}
    </div>
  );
}
