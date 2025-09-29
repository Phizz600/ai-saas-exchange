import { ReactNode } from "react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { MarketplacePaywall } from "./MarketplacePaywall";
import { useState } from "react";

interface AccessGatedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiresPremium?: boolean;
}

export function AccessGatedContent({ 
  children, 
  fallback, 
  requiresPremium = false 
}: AccessGatedContentProps) {
  const { hasMarketplaceAccess, isLoading } = useSubscriptionStatus();
  const [showPaywall, setShowPaywall] = useState(false);

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-lg h-20" />;
  }

  if (requiresPremium && !hasMarketplaceAccess) {
    return (
      <>
        {fallback || (
          <div 
            className="relative cursor-pointer group"
            onClick={() => setShowPaywall(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="font-semibold text-white">Premium Required</p>
                <p className="text-sm text-white/80">Click to upgrade</p>
              </div>
            </div>
            <div className="opacity-50 pointer-events-none">
              {children}
            </div>
          </div>
        )}
        <MarketplacePaywall 
          isOpen={showPaywall} 
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            window.location.reload(); // Refresh to update subscription status
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}