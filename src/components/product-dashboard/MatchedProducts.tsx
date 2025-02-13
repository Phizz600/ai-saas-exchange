
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const MatchedProducts = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matched-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('matched_products')
        .select('*')
        .eq('investor_id', user.id)
        .order('match_score', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }

      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
        <p className="text-gray-500 mb-4">Set up your investment preferences to get personalized AI product recommendations.</p>
        <Link to="/preferences">
          <Button className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]">
            <Settings className="w-4 h-4 mr-2" />
            Set Preferences
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.product_id} className="relative">
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white px-3 py-1 rounded-full text-sm font-medium">
              {Math.round(match.match_score)}% Match
            </span>
          </div>
          <ProductCard
            product={{
              id: match.product_id,
              title: match.title,
              description: match.description || "",
              price: Number(match.price),
              category: match.category,
              stage: match.stage,
              image: "/placeholder.svg",
              timeLeft: "24h left",
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
