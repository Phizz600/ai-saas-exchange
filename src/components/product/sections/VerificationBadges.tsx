
import { CheckCircle, Globe, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VerificationBadgesProps {
  isRevenueVerified: boolean;
  isCodeAudited: boolean;
  isTrafficVerified: boolean;
}

export function VerificationBadges({
  isRevenueVerified,
  isCodeAudited,
  isTrafficVerified
}: VerificationBadgesProps) {
  if (!isRevenueVerified && !isCodeAudited && !isTrafficVerified) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {isRevenueVerified && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 border border-green-200">
          <Shield className="h-3 w-3" />
          Revenue Verified via Stripe
        </Badge>
      )}
      {isCodeAudited && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200">
          <CheckCircle className="h-3 w-3" />
          Code Audit Passed
        </Badge>
      )}
      {isTrafficVerified && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200">
          <Globe className="h-3 w-3" />
          Traffic Verified via Google Analytics
        </Badge>
      )}
    </div>
  );
}
