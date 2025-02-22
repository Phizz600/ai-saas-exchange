
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { Card } from "@/components/ui/card";
import { Store, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const questions = [
  {
    id: 1,
    question: "What industries are you interested in?",
    description: "Select the industries you'd like to invest in"
  },
  {
    id: 2,
    question: "What's your investment budget?",
    description: "Specify your minimum and maximum investment range"
  },
  {
    id: 3,
    question: "What's your preferred investment timeline?",
    description: "How long do you plan to hold your investment?"
  },
  // ... add more questions as needed
];

export const MatchedProducts = () => {
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState<boolean | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

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

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

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
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{questions[currentQuestion].question}</h3>
              <p className="text-gray-600">{questions[currentQuestion].description}</p>
            </div>
            
            {/* Add your form fields here based on the current question */}
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Question content will go here</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Complete Your Buyer Profile</h3>
        <p className="text-gray-600 mb-4">
          Please complete the buyer profile questionnaire to see your matched products.
        </p>
        <Button 
          onClick={() => setShowQuestionnaire(true)}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          Complete Questionnaire
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
