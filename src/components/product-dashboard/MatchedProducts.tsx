
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Settings, Info, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PreferenceQuestionnaire } from "./PreferenceQuestionnaire";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MatchedProducts = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [sortBy, setSortBy] = useState<"match" | "price_asc" | "price_desc">("match");
  
  const { data: matches, isLoading, refetch } = useQuery({
    queryKey: ['matched-products', sortBy],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get investor preferences for match explanation
      const { data: preferences } = await supabase
        .from('investor_preferences')
        .select('*')
        .eq('user_id', user.id);

      // If no preferences are set, return empty array
      if (!preferences || preferences.length === 0) {
        return [];
      }

      // Get matched products
      let query = supabase
        .from('matched_products')
        .select('*')
        .eq('investor_id', user.id);

      // Apply sorting
      switch (sortBy) {
        case "price_asc":
          query = query.order('price', { ascending: true });
          break;
        case "price_desc":
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('match_score', { ascending: false });
      }

      query = query.limit(3);
      
      const { data: matchedProducts, error } = await query;

      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }

      return matchedProducts.map(match => ({
        ...match,
        matchDetails: {
          industryMatch: match.industry && preferences[0]?.preferred_industries?.includes(match.industry),
          businessModelMatch: match.business_model && preferences[0]?.business_model?.includes(match.business_model),
          timelineMatch: match.investment_timeline === preferences[0]?.investment_timeline,
          technicalMatch: getExpertiseMatch(preferences[0]?.technical_expertise, match.stage)
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
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {matches.map((match) => (
        <div key={match.product_id} className="relative group">
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
          <Link 
            to={`/product/${match.product_id}`}
            className="block transition-transform hover:-translate-y-1"
          >
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
          </Link>
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
