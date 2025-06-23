
import { useState, useEffect } from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, DollarSign, Bot, Building2, TrendingUp, Target, BarChart, Clock, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const buyerMatchingQuestions = [
  {
    id: 1,
    question: "What's your investment budget range?",
    description: "Select your preferred investment range",
    icon: DollarSign,
    options: [
      { value: "10k_50k", label: "$10K - $50K" },
      { value: "50k_200k", label: "$50K - $200K" },
      { value: "200k_1m", label: "$200K - $1M" },
      { value: "1m_plus", label: "$1M+" }
    ],
    field: "investment_budget"
  },
  {
    id: 2,
    question: "Which AI category interests you most?",
    description: "Select your primary area of interest",
    icon: Bot,
    options: [
      { value: "nlp", label: "Natural Language Processing" },
      { value: "content_generation", label: "Content Generation" },
      { value: "computer_vision", label: "Computer Vision" },
      { value: "data_analytics", label: "Data Analytics" },
      { value: "automation", label: "Automation Tools" },
      { value: "voice_speech", label: "Voice & Speech" }
    ],
    field: "preferred_categories"
  },
  {
    id: 3,
    question: "What revenue stage do you prefer?",
    description: "Select the revenue level you're targeting",
    icon: TrendingUp,
    options: [
      { value: "pre_revenue", label: "Pre-Revenue (MVP stage)" },
      { value: "early_revenue", label: "Early Revenue ($1K-$10K MRR)" },
      { value: "growing_revenue", label: "Growing Revenue ($10K-$50K MRR)" },
      { value: "established_revenue", label: "Established Revenue ($50K+ MRR)" }
    ],
    field: "revenue_requirements"
  },
  {
    id: 4,
    question: "Preferred development stage?",
    description: "What stage of product development interests you?",
    icon: BarChart,
    options: [
      { value: "mvp", label: "MVP / Early Stage" },
      { value: "growth", label: "Growth Stage" },
      { value: "established", label: "Established Product" },
      { value: "any", label: "Any Stage" }
    ],
    field: "investment_stage"
  },
  {
    id: 5,
    question: "Preferred business model?",
    description: "Which monetization model do you prefer?",
    icon: CreditCard,
    options: [
      { value: "subscription", label: "Subscription (SaaS)" },
      { value: "pay_per_use", label: "Pay Per Use" },
      { value: "freemium", label: "Freemium Model" },
      { value: "one_time", label: "One-Time Purchase" }
    ],
    field: "monetization_preferences"
  },
  {
    id: 6,
    question: "Which industry focus?",
    description: "Select your preferred target market",
    icon: Building2,
    options: [
      { value: "healthcare", label: "Healthcare" },
      { value: "fintech", label: "Financial Technology" },
      { value: "ecommerce", label: "E-commerce" },
      { value: "education", label: "Education" },
      { value: "marketing", label: "Marketing & Sales" },
      { value: "any", label: "Industry Agnostic" }
    ],
    field: "preferred_industries"
  },
  {
    id: 7,
    question: "Tech stack preference?",
    description: "Any specific technology preferences?",
    icon: Target,
    options: [
      { value: "openai", label: "OpenAI Powered" },
      { value: "cloud_native", label: "Cloud Native (AWS/GCP)" },
      { value: "python_based", label: "Python/ML Stack" },
      { value: "web_based", label: "Web Technologies" },
      { value: "mobile_first", label: "Mobile First" },
      { value: "no_preference", label: "No Preference" }
    ],
    field: "tech_stack_preferences"
  },
  {
    id: 8,
    question: "Investment timeline?",
    description: "How quickly are you looking to invest?",
    icon: Clock,
    options: [
      { value: "immediate", label: "Ready to invest now" },
      { value: "1_3_months", label: "Within 1-3 months" },
      { value: "3_6_months", label: "Within 3-6 months" },
      { value: "6_plus_months", label: "6+ months timeline" }
    ],
    field: "investment_timeline"
  }
];

interface BuyerMatchingQuestionnaireProps {
  onComplete?: () => void;
  variant?: "dashboard" | "comingSoon";
  className?: string;
}

export const BuyerMatchingQuestionnaire = ({
  onComplete,
  variant = "dashboard",
  className = ""
}: BuyerMatchingQuestionnaireProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [progress] = useState(80);
  const form = useForm();
  const { toast } = useToast();

  const handleOptionSelect = async (value: string) => {
    const currentAnswer = value;
    if (!currentAnswer) return;

    const questionData = buyerMatchingQuestions[currentQuestion];
    const fieldName = questionData.field;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log(`Saving ${fieldName} with value [${currentAnswer}] for user ${user.id}`);
        
        const { data: existingPrefs } = await supabase
          .from('investor_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingPrefs) {
          await supabase
            .from('investor_preferences')
            .update({
              current_question: currentQuestion + 1,
              [fieldName]: [currentAnswer]
            })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('investor_preferences')
            .insert({
              user_id: user.id,
              current_question: currentQuestion + 1,
              [fieldName]: [currentAnswer]
            });
        }
        
        console.log(`Successfully saved preference for ${fieldName}`);
      } else {
        const storedPreferences = JSON.parse(localStorage.getItem('buyer_preferences') || '{}');
        const updatedPreferences = {
          ...storedPreferences,
          current_question: currentQuestion + 1,
          [fieldName]: [currentAnswer]
        };
        localStorage.setItem('buyer_preferences', JSON.stringify(updatedPreferences));
        console.log(`Saved to localStorage: ${fieldName} = [${currentAnswer}]`);
      }

      if (currentQuestion === buyerMatchingQuestions.length - 1) {
        toast({
          title: "Profile Complete!",
          description: "Your buyer profile has been successfully saved."
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your preferences. Please try again."
      });
    }

    setTimeout(() => {
      if (currentQuestion < buyerMatchingQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setHasCompletedQuestionnaire(true);
        setShowQuestionnaire(false);
        if (onComplete) onComplete();
      }
    }, 500);
  };

  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: preferences } = await supabase
            .from('investor_preferences')
            .select('current_question')
            .eq('user_id', user.id)
            .maybeSingle();

          if (preferences?.current_question) {
            if (preferences.current_question >= buyerMatchingQuestions.length) {
              setHasCompletedQuestionnaire(true);
            } else {
              setCurrentQuestion(preferences.current_question);
            }
          }
        } else {
          const storedPreferences = JSON.parse(localStorage.getItem('buyer_preferences') || '{}');
          if (storedPreferences.current_question) {
            if (storedPreferences.current_question >= buyerMatchingQuestions.length) {
              setHasCompletedQuestionnaire(true);
            } else {
              setCurrentQuestion(storedPreferences.current_question);
            }
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadSavedProgress();
  }, []);

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (hasCompletedQuestionnaire) {
    const bgClass = variant === "comingSoon" ? "bg-white/90 backdrop-blur-sm" : "";
    return (
      <Card className={`p-6 text-center ${bgClass} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Perfect! You're all set!</h3>
          <p className="text-gray-600 mb-6">
            We'll analyze the marketplace and notify you when AI businesses match your criteria.
          </p>
          
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex justify-center">
              <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white">
                  Join The AI Exchange Club Newsletter
                </Button>
              </a>
            </div>

            <div className="text-sm text-gray-600">
              ✓ Get notified of matches &nbsp; • &nbsp; 
              ✓ Market insights &nbsp; • &nbsp; 
              ✓ Exclusive opportunities
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!showQuestionnaire) {
    const bgClass = variant === "comingSoon" ? "bg-white/90 backdrop-blur-sm" : "";
    return (
      <Card className={`p-6 text-center ${bgClass} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Find Your Perfect AI Investment</h3>
          <p className="text-gray-600">
            Answer 8 quick questions to get matched with AI businesses that fit your investment criteria.
          </p>
          <Button 
            onClick={() => setShowQuestionnaire(true)} 
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
          >
            Start Matching Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const currentQ = buyerMatchingQuestions[currentQuestion];
  const Icon = currentQ.icon;
  const bgClass = variant === "comingSoon" ? "bg-white/90 backdrop-blur-sm" : "";

  return (
    <Card className={`p-6 max-w-2xl mx-auto ${bgClass} ${className}`}>
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
            Question {currentQuestion + 1} of {buyerMatchingQuestions.length}
          </div>
          <Button 
            onClick={() => {
              const currentAnswer = form.getValues(`question_${currentQuestion}`);
              if (currentAnswer) handleOptionSelect(currentAnswer);
            }}
            disabled={!form.getValues(`question_${currentQuestion}`)}
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {currentQuestion === buyerMatchingQuestions.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
