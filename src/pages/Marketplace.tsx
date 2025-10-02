
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/CleanAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import ExpandableTabs from "@/components/ui/ExpandableTabs";
import { MarketplacePaywall } from "@/components/marketplace/MarketplacePaywall";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

export function Marketplace() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { hasMarketplaceAccess, isLoading: subscriptionLoading } = useSubscriptionStatus();
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const handleAuthenticatedRedirect = async () => {
      if (loading || !user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (!profile?.onboarding_completed) {
          navigate('/onboarding-redirect', { replace: true });
          return;
        }

        // User has completed onboarding - allow them to stay on marketplace
        // No automatic redirect to dashboard - let users choose where to go
      } catch (error) {
        console.error('Error during authenticated redirect:', error);
      }
    };

    handleAuthenticatedRedirect();
  }, [user, loading, navigate]);

  // Show paywall if user doesn't have marketplace access
  useEffect(() => {
    if (!loading && !subscriptionLoading && user && !hasMarketplaceAccess) {
      setShowPaywall(true);
    }
  }, [loading, subscriptionLoading, user, hasMarketplaceAccess]);

  return (
    <AnimatedGradientBackground>
      <ExpandableTabs />
      {hasMarketplaceAccess ? (
        <MarketplaceLayout />
      ) : (
        <MarketplacePaywall 
          isOpen={showPaywall} 
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            window.location.reload();
          }}
        />
      )}
    </AnimatedGradientBackground>
  );
}

// Default export for lazy loading
export default Marketplace;
