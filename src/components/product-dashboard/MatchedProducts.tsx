
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { Card } from "@/components/ui/card";
import { Store, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const MatchedProducts = () => {
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState<boolean | null>(null);

  useEffect(() => {
    const checkQuestionnaireStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: preferences } = await supabase
        .from('investor_preferences')
        .select('current_question')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasCompletedQuestionnaire(preferences?.current_question >= 10);
    };

    checkQuestionnaireStatus();
  }, []);

  const { data: matchedProducts = [], isLoading } = useQuery({
    queryKey: ['matchedProducts'],
    queryFn: getMatchedProducts,
    enabled: hasCompletedQuestionnaire === true
  });

  if (isLoading || hasCompletedQuestionnaire === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasCompletedQuestionnaire) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Complete Your Investment Preferences</h3>
        <p className="text-gray-600 mb-4">
          Please complete the investment preferences questionnaire to see your matched products.
        </p>
        <Button 
          asChild
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
        >
          <Link to="/preferences" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Complete Questionnaire
          </Link>
        </Button>
      </Card>
    );
  }

  if (!matchedProducts.length) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
        <p className="text-gray-600 mb-4">
          We'll notify you when we find products that match your investment preferences.
        </p>
        <Button 
          asChild
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
        >
          <Link to="/marketplace" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Browse Marketplace
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {matchedProducts.map((product) => (
        <ProductCard
          key={product.product_id}
          product={{
            id: product.product_id,
            title: product.title,
            description: product.description || "",
            price: Number(product.price),
            category: product.category,
            stage: product.stage,
            monthlyRevenue: 0,
            image: product.image_url || "/placeholder.svg",
            seller: {
              id: "",
              name: "",
              avatar: "",
              achievements: []
            }
          }}
        />
      ))}
    </div>
  );
};
