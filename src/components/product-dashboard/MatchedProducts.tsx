
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PreferenceQuestionnaire } from "./PreferenceQuestionnaire";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const MatchedProducts = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  
  const { data: matches, isLoading, refetch } = useQuery({
    queryKey: ['matched-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get investor preferences for match explanation
      const { data: preferences } = await supabase
        .from('investor_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get matched products
      const { data: matchedProducts, error } = await supabase
        .from('matched_products')
        .select(`
          *,
          products (
            business_model,
            investment_timeline,
            industry,
            technical_expertise_required:stage
          )
        `)
        .eq('investor_id', user.id)
        .order('match_score', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }

      return matchedProducts.map(match => ({
        ...match,
        matchDetails: {
          industryMatch: match.products?.industry && preferences?.preferred_industries?.includes(match.products.industry),
          businessModelMatch: match.products?.business_model && preferences?.business_model?.includes(match.products.business_model),
          timelineMatch: match.products?.investment_timeline === preferences?.investment_timeline,
          technicalMatch: getExpertiseMatch(preferences?.technical_expertise, match.products?.technical_expertise_required)
        }
      }));
    }
  });

  const getExpertiseMatch = (userExpertise?: string, requiredExpertise?: string) => {
    const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    if (!userExpertise || !requiredExpertise) return false;
    
    const userLevel = levels[userExpertise as keyof typeof levels] || 0;
    const requiredLevel = requiredExpertise === 'MVP' ? 1 : 
                         requiredExpertise === 'Growth' ? 2 : 3;
    
    return userLevel >= requiredLevel;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (showQuestionnaire) {
    return (
      <PreferenceQuestionnaire
        onComplete={() => {
          setShowQuestionnaire(false);
          refetch();
        }}
      />
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
        <p className="text-gray-500 mb-4">Set up your investment preferences to get personalized AI product recommendations.</p>
        <Button 
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
          onClick={() => setShowQuestionnaire(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Set Preferences
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.product_id} className="relative">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white px-3 py-1 rounded-full text-sm font-medium">
              {Math.round(match.match_score)}% Match
            </span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Match Details</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Industry Match:</span>
                      <span className={match.matchDetails.industryMatch ? "text-green-500" : "text-gray-500"}>
                        {match.matchDetails.industryMatch ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Business Model:</span>
                      <span className={match.matchDetails.businessModelMatch ? "text-green-500" : "text-gray-500"}>
                        {match.matchDetails.businessModelMatch ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Investment Timeline:</span>
                      <span className={match.matchDetails.timelineMatch ? "text-green-500" : "text-gray-500"}>
                        {match.matchDetails.timelineMatch ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Technical Expertise:</span>
                      <span className={match.matchDetails.technicalMatch ? "text-green-500" : "text-gray-500"}>
                        {match.matchDetails.technicalMatch ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <ProductCard
            product={{
              id: match.product_id,
              title: match.title,
              description: match.description || "",
              price: Number(match.price),
              category: match.category,
              stage: match.stage,
              monthlyRevenue: 0,
              image: "/placeholder.svg",
              timeLeft: "24h left",
              auction_end_time: undefined,
              starting_price: undefined,
              current_price: undefined,
              min_price: undefined,
              price_decrement: undefined,
              seller: {
                id: "",
                name: "Anonymous",
                avatar: "/placeholder.svg",
                achievements: []
              }
            }}
          />
        </div>
      ))}
      <Link to="/matches" className="block">
        <Button variant="outline" className="w-full">
          View All Matches
        </Button>
      </Link>
    </div>
  );
};
