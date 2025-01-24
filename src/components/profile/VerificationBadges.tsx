import { UserCheck, MailCheck, Phone } from "lucide-react";

export const VerificationBadges = () => {
  return (
    <div className="mt-4 space-y-2 text-left w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UserCheck className="w-4 h-4" />
        Identity Verified
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MailCheck className="w-4 h-4" />
        Email Verified
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="w-4 h-4" />
        Phone Verified
      </div>
    </div>
  );
};