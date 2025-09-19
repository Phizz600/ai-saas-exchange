
import { UserCheck, MailCheck, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VerificationBadges = () => {
  const [verifications, setVerifications] = useState<{
    email: boolean;
    identity: boolean;
    phone: boolean;
  }>({
    email: false,
    identity: false,
    phone: false
  });

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('user_verifications')
            .select('verification_type, status')
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error("Error fetching verification status:", error);
            return;
          }
          
          const verificationStatus = {
            email: true, // Email is verified if user can access profile page
            identity: data?.some(v => v.verification_type === 'identity' && v.status === 'verified') ?? false,
            phone: data?.some(v => v.verification_type === 'phone' && v.status === 'verified') ?? false
          };
          
          setVerifications(verificationStatus);
        }
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      }
    };
    
    fetchVerificationStatus();
  }, []);

  return (
    <div className="mt-4 space-y-2 text-left w-full">
      <div className={`flex items-center gap-2 text-sm ${verifications.identity ? "text-green-500" : "text-muted-foreground"}`}>
        <UserCheck className="w-4 h-4" />
        Identity {verifications.identity ? "Verified" : "Not Verified"}
      </div>
      <div className={`flex items-center gap-2 text-sm ${verifications.email ? "text-green-500" : "text-muted-foreground"}`}>
        <MailCheck className="w-4 h-4" />
        Email {verifications.email ? "Verified" : "Not Verified"}
      </div>
      <div className={`flex items-center gap-2 text-sm ${verifications.phone ? "text-green-500" : "text-muted-foreground"}`}>
        <Phone className="w-4 h-4" />
        Phone {verifications.phone ? "Verified" : "Not Verified"}
      </div>
    </div>
  );
};
