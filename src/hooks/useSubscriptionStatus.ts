import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/CleanAuthContext";

interface SubscriptionData {
  id: string;
  subscription_type: string;
  status: string;
  amount: number;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
}

interface UseSubscriptionStatusReturn {
  hasMarketplaceAccess: boolean;
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSubscriptionStatus(): UseSubscriptionStatusReturn {
  const { user } = useAuth();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['subscription-status', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Check for active marketplace subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('subscription_type', 'marketplace-subscription')
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasMarketplaceAccess = Boolean(
    subscription && 
    subscription.status === 'active' && 
    (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date())
  );

  return {
    hasMarketplaceAccess,
    subscription,
    isLoading,
    error: error as Error | null,
  };
}