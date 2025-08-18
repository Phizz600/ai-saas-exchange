
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/CleanAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Footer } from "@/components/Footer";

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

        // If user has completed onboarding, redirect based on user type
        if (profile?.user_type === 'ai_investor') {
          navigate('/browse-marketplace', { replace: true });
        } else if (profile?.user_type === 'ai_builder') {
          navigate('/product-dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error during authenticated redirect:', error);
      }
    };

    handleAuthenticatedRedirect();
  }, [user, loading, navigate]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <MarketplaceLayout />
      <Footer />
    </div>
  );
}

// Default export for lazy loading
export default Marketplace;
