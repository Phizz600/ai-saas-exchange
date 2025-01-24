import { UserCheck, MailCheck, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const VerificationBadges = () => {
  return (
    <div className="mt-4 space-y-2">
      <Badge variant="secondary" className="flex items-center gap-2 w-full justify-center py-2">
        <UserCheck className="w-4 h-4" />
        Identity Verified
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-2 w-full justify-center py-2">
        <MailCheck className="w-4 h-4" />
        Email Verified
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-2 w-full justify-center py-2">
        <Phone className="w-4 h-4" />
        Phone Verified
      </Badge>
    </div>
  );
};