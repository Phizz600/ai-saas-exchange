import { useState, useEffect } from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
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
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const questions = [
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
    ],
    field: "investment_goals"
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
    ],
    field: "investment_budget"
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
    ],
    field: "investment_stage"
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
    ],
    field: "monetization_preferences"
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
    ],
    field: "risk_appetite"
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
    ],
    field: "target_market"
  },
  {
    id: 7,
    question: "LLM Integration Preferences?",
    description: "Select your preferred LLM provider",
    icon: Bot,
    options: [
      { value: "openai", label: "OpenAI" },
      { value: "claude", label: "Claude" },
      { value: "deepseek", label: "DeepSeek" },
      { value: "mistral", label: "Mistral AI" },
      { value: "gemini", label: "Gemini" },
      { value: "llama", label: "Llama" }
    ],
    field: "llm_preferences"
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
    ],
    field: "traffic_importance"
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
    ],
    field: "investment_timeline"
  }
];

interface InvestorQuestionnaireProps {
  onComplete?: () => void;
  showNewsletterButton?: boolean;
  variant?: "dashboard" | "comingSoon";
  className?: string;
}

export const InvestorQuestionnaire = ({ 
  onComplete, 
  showNewsletterButton = false,
  variant = "dashboard",
  className = ""
}: InvestorQuestionnaireProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const form = useForm();
  const { toast } = useToast();
  
  const handleOptionSelect = async (value: string) => {
    const currentAnswer = value;
    if (!currentAnswer) return;

    const questionData = questions[currentQuestion];
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
        const storedPreferences = JSON.parse(localStorage.getItem('investor_preferences') || '{}');
        const updatedPreferences = {
          ...storedPreferences,
          current_question: currentQuestion + 1,
          [fieldName]: [currentAnswer]
        };
        localStorage.setItem('investor_preferences', JSON.stringify(updatedPreferences));
        console.log(`Saved to localStorage: ${fieldName} = [${currentAnswer}]`);
      }

      if (currentQuestion === questions.length - 1) {
        toast({
          title: "Profile Complete!",
          description: "Your investor profile has been successfully saved.",
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
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
            if (preferences.current_question >= questions.length) {
              setHasCompletedQuestionnaire(true);
            } else {
              setCurrentQuestion(preferences.current_question);
            }
          }
        } else {
          const storedPreferences = JSON.parse(localStorage.getItem('investor_preferences') || '{}');
          if (storedPreferences.current_question) {
            if (storedPreferences.current_question >= questions.length) {
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
    const bgClass = variant === "comingSoon" 
      ? "bg-white/90 backdrop-blur-sm" 
      : "";
      
    return (
      <Card className={`p-6 text-center ${bgClass} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Thank you for completing your investor profile!</h3>
          <p className="text-gray-600">
            We'll match you with AI products that align with your investment preferences and send you weekly emails with personalized recommendations. 
            You'll receive match notifications directly to your inbox each week so you never miss a perfect opportunity. 
            Join our newsletter below for additional exclusive deals and early access to promising AI tools.
          </p>
          
          {showNewsletterButton && (
            <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-full max-w-md mt-4">
              <Button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white">
                Join The AI Exchange Club Newsletter
              </Button>
            </a>
          )}
        </div>
      </Card>
    );
  }

  if (!showQuestionnaire) {
    const bgClass = variant === "comingSoon" 
      ? "bg-white/90 backdrop-blur-sm" 
      : "";
      
    return (
      <Card className={`p-6 text-center ${bgClass} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Complete Your Investor Profile</h3>
          <p className="text-gray-600">
            Answer a few questions to help us match you with AI products that fit your investment criteria.
          </p>
          <Button 
            onClick={() => setShowQuestionnaire(true)}
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
          >
            Start Questionnaire
          </Button>
        </div>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const Icon = currentQ.icon;
  const bgClass = variant === "comingSoon" 
    ? "bg-white/90 backdrop-blur-sm" 
    : "";

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
};
