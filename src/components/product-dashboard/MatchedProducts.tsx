
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { Card } from "@/components/ui/card";
import { 
  Store, 
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { InvestorQuestionnaire } from "@/components/investor/InvestorQuestionnaire";

// Define the matched product type
interface MatchedProduct {
  product_id: string;
  investor_id: string;
  match_score: number;
  title: string;
  description: string | null;
  price: number;
  category: string;
  stage: string;
  image_url: string | null;
}

export const MatchedProducts = () => {
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState<boolean | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  useEffect(() => {
    const checkQuestionnaireStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: preferences } = await supabase
        .from('investor_preferences')
        .select('current_question')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasCompletedQuestionnaire(preferences?.current_question >= 9);
    };

    checkQuestionnaireStatus();
  }, []);

  const { data: matchedProducts = [], isLoading } = useQuery<MatchedProduct[]>({
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
    if (showQuestionnaire) {
      return (
        <InvestorQuestionnaire 
          variant="dashboard"
          onComplete={() => {
            setHasCompletedQuestionnaire(true);
            setShowQuestionnaire(false);
          }} 
        />
      );
    }

    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Complete Your Buyer Profile</h3>
          <p className="text-gray-600">
            Please complete the buyer profile questionnaire to see your matched products.
          </p>
          <Button 
            onClick={() => setShowQuestionnaire(true)}
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            Complete Questionnaire
          </Button>
        </div>
      </Card>
    );
  }

  if (!matchedProducts.length) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-2xl font-semibold mb-2 exo-2-heading">No Matches Found</h3>
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
