import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { Card } from "@/components/ui/card";
import { 
  Store, 
  ClipboardList,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { InvestorQuestionnaire } from "@/components/investor/InvestorQuestionnaire";
import { Product } from "@/types/product";
import { toast } from "sonner";

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

  // Check if the user has completed the questionnaire
  useEffect(() => {
    const checkQuestionnaireStatus = async () => {
      try {
        console.log('Checking questionnaire completion status...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          setHasCompletedQuestionnaire(false);
          return;
        }

        console.log('Fetching investor preferences for user:', user.id);
        const { data: preferences, error } = await supabase
          .from('investor_preferences')
          .select('current_question')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching investor preferences:', error);
          return;
        }

        // Change the threshold from 9 to 5 questions to be more lenient
        const hasCompleted = preferences?.current_question >= 5;
        console.log('Questionnaire completion status:', hasCompleted, 'Current question:', preferences?.current_question);
        setHasCompletedQuestionnaire(hasCompleted);
      } catch (error) {
        console.error('Error in checkQuestionnaireStatus:', error);
        toast.error('Failed to check questionnaire status');
      }
    };

    checkQuestionnaireStatus();
  }, []);

  // Fetch matched products when the questionnaire is completed
  const { data: matchedProducts = [], isLoading, error, refetch } = useQuery<MatchedProduct[]>({
    queryKey: ['matchedProducts'],
    queryFn: async () => {
      console.log('Fetching matched products...');
      const products = await getMatchedProducts();
      console.log('Matched products received:', products);
      return products;
    },
    enabled: hasCompletedQuestionnaire === true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });

  const handleRefresh = () => {
    console.log('Manually refreshing matched products...');
    refetch();
    toast.success('Refreshing product matches...');
  };

  // Loading state
  if (isLoading || hasCompletedQuestionnaire === null) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500 text-sm">Loading your matched products...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error('Error fetching matched products:', error);
    return (
      <Card className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Error Loading Matches</h3>
        <p className="text-gray-600 mb-4">
          We encountered a problem while loading your matched products.
        </p>
        <Button 
          onClick={() => refetch()}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </Card>
    );
  }

  // Questionnaire not completed
  if (!hasCompletedQuestionnaire) {
    if (showQuestionnaire) {
      return (
        <InvestorQuestionnaire 
          variant="dashboard"
          onComplete={() => {
            setHasCompletedQuestionnaire(true);
            setShowQuestionnaire(false);
            // Refresh matched products after completing questionnaire
            refetch();
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
            Our AI system will match you with products that fit your investment preferences.
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

  // No matched products found
  if (!matchedProducts.length) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-2xl font-semibold mb-2 exo-2-heading">No Matches Found</h3>
        <p className="text-gray-600 mb-4">
          We'll notify you when we find products that match your investment preferences.
          You can also browse the marketplace to explore all available products.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <Link to="/marketplace" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Browse Marketplace
            </Link>
          </Button>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Matches
          </Button>
        </div>
      </Card>
    );
  }

  // Successfully found matched products
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Found {matchedProducts.length} products matching your investment preferences
        </p>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>
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
              image_url: product.image_url || "/placeholder.svg",
              seller_id: product.investor_id,
              match_score: product.match_score
            } as Product}
          />
        ))}
      </div>
    </div>
  );
};
