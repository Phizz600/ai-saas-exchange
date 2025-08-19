import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/CleanAuthContext';
import { supabase } from '@/integrations/supabase/client';

export function OnboardingRedirect() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      if (loading) return;
      
      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }

      try {
        // Get user profile to determine type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          navigate('/browse-marketplace', { replace: true });
          return;
        }

        // Mark onboarding as completed
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);

        // Redirect based on user type
        if (profile?.user_type === 'ai_builder') {
          // Sellers go to airtable listing form
          const airtableUrl = "https://airtable.com/appWPKhz1fWsY1Fd7/pagS7ZmjO15EYF1a1/form";
          window.open(airtableUrl, '_blank');
          // Navigate to browse marketplace
          navigate('/browse-marketplace', { replace: true });
        } else if (profile?.user_type === 'ai_investor') {
          // Buyers go to browse marketplace
          navigate('/browse-marketplace', { replace: true });
        } else {
          // Fallback to browse marketplace
          navigate('/browse-marketplace', { replace: true });
        }
      } catch (error) {
        console.error('Error during onboarding redirect:', error);
        navigate('/browse-marketplace', { replace: true });
      }
    };

    handleRedirect();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-lg">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        <p className="text-white text-lg">Redirecting you...</p>
      </div>
    </div>
  );
}