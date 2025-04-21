
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Mail, Phone, Shield } from "lucide-react";

interface VerificationStatus {
  email: 'pending' | 'verified' | 'rejected' | 'expired';
  phone: 'pending' | 'verified' | 'rejected' | 'expired';
  identity: 'pending' | 'verified' | 'rejected' | 'expired';
}

export function VerificationSection() {
  const [status, setStatus] = useState<VerificationStatus>({
    email: 'pending',
    phone: 'pending',
    identity: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data: verifications, error } = await supabase
        .from('user_verifications')
        .select('*');

      if (error) throw error;

      const newStatus = { ...status };
      verifications?.forEach(v => {
        newStatus[v.verification_type as keyof VerificationStatus] = v.status;
      });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

  const handleVerificationRequest = async (type: keyof VerificationStatus) => {
    setLoading(true);
    try {
      // Send verification request to edge function
      const { error } = await supabase.functions.invoke('request-verification', {
        body: { type }
      });

      if (error) throw error;
      
      toast({ 
        title: "Verification Requested",
        description: `Please check your ${type === 'email' ? 'email' : 'phone'} for verification instructions.`
      });
      
      await loadVerificationStatus();
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({ 
        title: "Error requesting verification",
        variant: "destructive",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (type: keyof VerificationStatus) => {
    const variants = {
      pending: "default",
      verified: "secondary", // Changed from "success"
      rejected: "destructive",
      expired: "outline"
    };

    return (
      <Badge variant={variants[status[type]] as "default" | "destructive" | "outline" | "secondary"}>
        {status[type].charAt(0).toUpperCase() + status[type].slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-exo">Verification Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>Email Verification</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('email')}
            {status.email !== 'verified' && (
              <Button 
                size="sm" 
                onClick={() => handleVerificationRequest('email')}
                disabled={loading}
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <span>Phone Verification</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('phone')}
            {status.phone !== 'verified' && (
              <Button 
                size="sm" 
                onClick={() => handleVerificationRequest('phone')}
                disabled={loading}
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Identity Verification</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('identity')}
            {status.identity !== 'verified' && (
              <Button 
                size="sm" 
                onClick={() => handleVerificationRequest('identity')}
                disabled={loading}
              >
                Verify
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
