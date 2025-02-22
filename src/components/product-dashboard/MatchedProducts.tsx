
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { Card } from "@/components/ui/card";
import { 
  Store, 
  ClipboardList, 
  ChevronLeft, 
  ChevronRight,
  Target,
  DollarSign,
  BarChart,
  CreditCard,
  TrendingUp,
  Building2,
  Bot,
  Users,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const questions = [
  {
    id: 1,
    question: "What are your investment goals?",
    description: "Select your primary objective for investing in AI tools",
    icon: Target,
    options: [
      { value: "growth", label: "Growth & Scaling" },
      { value: "income", label: "Steady Income" },
      { value: "acquisition", label: "Strategic Acquisition" },
      { value: "portfolio", label: "Portfolio Diversification" }
    ]
  },
  {
    id: 2,
    question: "What's your investment budget?",
    description: "Select your preferred investment range",
    icon: DollarSign,
    options: [
      { value: "seed", label: "Seed ($10K - $50K)" },
      { value: "small", label: "Small ($50K - $200K)" },
      { value: "medium", label: "Medium ($200K - $1M)" },
      { value: "large", label: "Large ($1M+)" }
    ]
  },
  {
    id: 3,
    question: "What development stage interests you?",
    description: "Select your preferred stage of product development",
    icon: BarChart,
    options: [
      { value: "mvp", label: "MVP / Early Stage" },
      { value: "growth", label: "Growth Stage" },
      { value: "established", label: "Established" },
      { value: "any", label: "Any Stage" }
    ]
  },
  {
    id: 4,
    question: "Preferred monetization strategy?",
    description: "Select the business model you're most interested in",
    icon: CreditCard,
    options: [
      { value: "subscription", label: "Subscription" },
      { value: "pay_per_use", label: "Pay Per Use" },
      { value: "freemium", label: "Freemium" },
      { value: "one_time", label: "One Time Purchase" }
    ]
  },
  {
    id: 5,
    question: "What's your risk tolerance?",
    description: "Select your preferred risk level",
    icon: TrendingUp,
    options: [
      { value: "conservative", label: "Conservative" },
      { value: "moderate", label: "Moderate" },
      { value: "aggressive", label: "Aggressive" },
      { value: "flexible", label: "Flexible" }
    ]
  },
  {
    id: 6,
    question: "Which AI capabilities interest you?",
    description: "Select the AI capabilities you'd like to invest in",
    icon: Building2,
    options: [
      { value: "nlp", label: "Natural Language Processing" },
      { value: "ml", label: "Machine Learning" },
      { value: "content_gen", label: "Content Generation" },
      { value: "computer_vision", label: "Computer Vision" },
      { value: "voice_speech", label: "Voice & Speech" },
      { value: "data_analytics", label: "Data Analytics" },
      { value: "automation", label: "Automation" },
      { value: "recommendation", label: "Recommendation Systems" }
    ]
  },
  {
    id: 7,
    question: "LLM Integration Preferences?",
    description: "Select your preferred LLM integration approach",
    icon: Bot,
    options: [
      { value: "proprietary", label: "Proprietary LLM" },
      { value: "openai", label: "OpenAI Integration" },
      { value: "hybrid", label: "Hybrid Approach" },
      { value: "any", label: "Any Integration" }
    ]
  },
  {
    id: 8,
    question: "How important is traffic/traction?",
    description: "Select the level of existing traction you require",
    icon: Users,
    options: [
      { value: "essential", label: "Essential" },
      { value: "important", label: "Important" },
      { value: "nice", label: "Nice to Have" },
      { value: "not_important", label: "Not Important" }
    ]
  },
  {
    id: 9,
    question: "Investment Timeline",
    description: "How long do you plan to hold your investment?",
    icon: Clock,
    options: [
      { value: "short", label: "Short Term (1-2 years)" },
      { value: "medium", label: "Medium Term (2-5 years)" },
      { value: "long", label: "Long Term (5+ years)" },
      { value: "flexible", label: "Flexible" }
    ]
  }
];

export const MatchedProducts = () => {
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState<boolean | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const form = useForm();

  useEffect(() => {
    const checkQuestionnaireStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: preferences } = await supabase
        .from('investor_preferences')
        .select('current_question')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasCompletedQuestionnaire(preferences?.current_question >= questions.length);
    };

    checkQuestionnaireStatus();
  }, []);

  const { data: matchedProducts = [], isLoading } = useQuery({
    queryKey: ['matchedProducts'],
    queryFn: getMatchedProducts,
    enabled: hasCompletedQuestionnaire === true
  });

  const handleOptionSelect = async (value: string) => {
    const currentAnswer = value;
    if (!currentAnswer) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save the answer to the database
    await supabase
      .from('investor_preferences')
      .update({ 
        current_question: currentQuestion + 1,
        [`${questions[currentQuestion].id === 8 ? 'traffic_importance' : 
          questions[currentQuestion].id === 7 ? 'llm_preferences' :
          questions[currentQuestion].id === 4 ? 'monetization_preferences' :
          'investment_goals'}`]: [currentAnswer]
      })
      .eq('user_id', user.id);

    // Automatically advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setHasCompletedQuestionnaire(true);
        setShowQuestionnaire(false);
      }
    }, 500); // 500ms delay for visual feedback
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
      const currentQ = questions[currentQuestion];
      const Icon = currentQ.icon;

      return (
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] rounded-full">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 exo-2-heading">{currentQ.question}</h3>
              <p className="text-gray-600">{currentQ.description}</p>
            </div>
            
            <Form {...form}>
              <FormField
                name={`question_${currentQuestion}`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleOptionSelect(value);
                        }}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {currentQ.options.map((option) => (
                          <div key={option.value} className="relative">
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={option.value}
                              className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-[#8B5CF6] peer-checked:bg-purple-50 transition-all duration-300"
                            >
                              <span className="font-medium">{option.label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>

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
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <Button
                onClick={() => {
                  const currentAnswer = form.getValues(`question_${currentQuestion}`);
                  if (currentAnswer) handleOptionSelect(currentAnswer);
                }}
                disabled={!form.getValues(`question_${currentQuestion}`)}
                className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
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
