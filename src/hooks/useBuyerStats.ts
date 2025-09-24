import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BuyerStats {
  totalOffersValue: number;
  totalOffersMade: number;
  acceptedOffers: number;
  activeOffers: number;
  portfolioValue: number;
  averageDealSize: number;
  offerSuccessRate: number;
  companiesUnderReview: number;
  ndasSigned: number;
  dealVelocity: number;
  totalOffersValueChange?: { value: number; type: 'increase' | 'decrease' };
  totalOffersMadeChange?: { value: number; type: 'increase' | 'decrease' };
  acceptedOffersChange?: { value: number; type: 'increase' | 'decrease' };
  portfolioValueChange?: { value: number; type: 'increase' | 'decrease' };
  offerSuccessRateChange?: { value: number; type: 'increase' | 'decrease' };
  dealVelocityChange?: { value: number; type: 'increase' | 'decrease' };
}

export const useBuyerStats = () => {
  return useQuery({
    queryKey: ['buyer-dashboard-stats'],
    queryFn: async (): Promise<BuyerStats | null> => {
      console.log('Fetching buyer dashboard stats');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Authenticated buyer ID:', user.id);

      // Get all offers made by the buyer
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('bidder_id', user.id);

      if (offersError) {
        console.error('Error fetching buyer offers:', offersError);
        throw offersError;
      }

      console.log('Total offers made:', offers?.length || 0);

      // Get escrow transactions where user is the buyer
      const { data: escrowTransactions, error: escrowError } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('buyer_id', user.id);

      if (escrowError) {
        console.error('Error fetching buyer escrow transactions:', escrowError);
      }

      // Get NDAs signed by the buyer
      const { data: signedNdas, error: ndasError } = await supabase
        .from('product_ndas')
        .select('*')
        .eq('user_id', user.id);

      if (ndasError) {
        console.error('Error fetching signed NDAs:', ndasError);
      }

      // Get conversations (companies under review)
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq('buyer_id', user.id);

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
      }

      // Calculate last month data for comparison
      const lastMonthStart = new Date();
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      lastMonthStart.setDate(1);
      const lastMonthEnd = new Date();
      lastMonthEnd.setDate(0);

      const { data: lastMonthOffers } = await supabase
        .from('offers')
        .select('*')
        .eq('bidder_id', user.id)
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      const { data: lastMonthEscrows } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('buyer_id', user.id)
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      if (!offers) return null;

      // Calculate current metrics
      const totalOffersValue = offers.reduce((sum, offer) => sum + (offer.amount || 0), 0);
      const totalOffersMade = offers.length;
      const acceptedOffers = offers.filter(o => o.status === 'accepted').length;
      const activeOffers = offers.filter(o => o.status === 'pending').length;
      const portfolioValue = escrowTransactions?.reduce((sum, escrow) => sum + (escrow.amount || 0), 0) || 0;
      const averageDealSize = totalOffersMade > 0 ? totalOffersValue / totalOffersMade : 0;
      const offerSuccessRate = totalOffersMade > 0 ? (acceptedOffers / totalOffersMade) * 100 : 0;
      const companiesUnderReview = conversations?.length || 0;
      const ndasSigned = signedNdas?.length || 0;

      // Calculate deal velocity (offers per month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthOffers = offers.filter(offer => {
        const offerDate = new Date(offer.created_at);
        return offerDate.getMonth() === currentMonth && offerDate.getFullYear() === currentYear;
      });
      const dealVelocity = thisMonthOffers.length;

      // Calculate last month metrics
      const lastMonthTotalOffersValue = lastMonthOffers?.reduce((sum, offer) => sum + (offer.amount || 0), 0) || 0;
      const lastMonthTotalOffersMade = lastMonthOffers?.length || 0;
      const lastMonthAcceptedOffers = lastMonthOffers?.filter(o => o.status === 'accepted').length || 0;
      const lastMonthPortfolioValue = lastMonthEscrows?.reduce((sum, escrow) => sum + (escrow.amount || 0), 0) || 0;
      const lastMonthOfferSuccessRate = lastMonthTotalOffersMade > 0 ? (lastMonthAcceptedOffers / lastMonthTotalOffersMade) * 100 : 0;
      const lastMonthDealVelocity = lastMonthTotalOffersMade;

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? { value: 100, type: 'increase' as const } : undefined;
        const percentage = Math.round(((current - previous) / previous) * 100);
        return {
          value: Math.abs(percentage),
          type: percentage >= 0 ? 'increase' as const : 'decrease' as const
        };
      };

      const stats = {
        totalOffersValue,
        totalOffersMade,
        acceptedOffers,
        activeOffers,
        portfolioValue,
        averageDealSize,
        offerSuccessRate,
        companiesUnderReview,
        ndasSigned,
        dealVelocity,
        totalOffersValueChange: calculateChange(totalOffersValue, lastMonthTotalOffersValue),
        totalOffersMadeChange: calculateChange(totalOffersMade, lastMonthTotalOffersMade),
        acceptedOffersChange: calculateChange(acceptedOffers, lastMonthAcceptedOffers),
        portfolioValueChange: calculateChange(portfolioValue, lastMonthPortfolioValue),
        offerSuccessRateChange: calculateChange(offerSuccessRate, lastMonthOfferSuccessRate),
        dealVelocityChange: calculateChange(dealVelocity, lastMonthDealVelocity),
      };

      console.log('Final buyer stats:', stats);
      return stats;
    },
    retry: 1,
  });
};