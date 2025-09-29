
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/CleanAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import ExpandableTabs from "@/components/ui/ExpandableTabs";

export function Marketplace() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleAuthenticatedRedirect = async () => {
      if (loading || !user) return;

      try {
        // Check if user has completed onboarding
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        // If user hasn't completed onboarding, redirect to onboarding
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

  return (
    <AnimatedGradientBackground>
      <ExpandableTabs />
      <MarketplaceLayout />
    </AnimatedGradientBackground>
  );
}

// Default export for lazy loading
export default Marketplace;
