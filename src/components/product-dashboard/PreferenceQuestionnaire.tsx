
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const questions = [
  {
    id: 1,
    title: "What industries are you most interested in?",
    type: "multiple",
    options: [
      { id: "healthcare", label: "Healthcare" },
      { id: "fintech", label: "Fintech" },
      { id: "ecommerce", label: "E-commerce" },
      { id: "autonomous_vehicles", label: "Autonomous Vehicles" },
      { id: "nlp", label: "NLP" },
      { id: "computer_vision", label: "Computer Vision" },
      { id: "other", label: "Other" }
    ]
  },
  {
    id: 2,
    title: "What's your typical investment size?",
    type: "single",
    options: [
      { id: "under_10k", label: "Under $10K" },
      { id: "10k_50k", label: "10K–50K" },
      { id: "50k_100k", label: "50K–100K" },
      { id: "over_100k", label: "$100K+" }
    ]
  },
  {
    id: 3,
    title: "What's your risk appetite?",
    type: "single",
    options: [
      { id: "low_risk", label: "Low (Established products with steady revenue)" },
      { id: "moderate_risk", label: "Medium (Growing products with some traction)" },
      { id: "high_risk", label: "High (Early-stage products with high growth potential)" }
    ]
  },
  {
    id: 4,
    title: "AI Category",
    type: "single",
    options: [
      { id: "natural_language_processing", label: "Natural Language Processing" },
      { id: "machine_learning", label: "Machine Learning" },
      { id: "content_generation", label: "Content Generation" },
      { id: "computer_vision", label: "Computer Vision" },
      { id: "voice_speech", label: "Voice & Speech" },
      { id: "data_analytics", label: "Data Analytics" },
      { id: "automation", label: "Automation" },
      { id: "recommendation_systems", label: "Recommendation Systems" },
      { id: "other", label: "Other" }
    ]
  },
  {
    id: 5,
    title: "What's your technical expertise?",
    type: "single",
    options: [
      { id: "beginner", label: "Beginner (Looking for turnkey solutions)" },
      { id: "intermediate", label: "Intermediate (Comfortable with some technical integration)" },
      { id: "advanced", label: "Advanced (Can handle complex AI systems)" }
    ]
  },
  {
    id: 6,
    title: "Are you looking for specific integrations or tech stacks?",
    type: "multiple",
    options: [
      { id: "slack", label: "Slack" },
      { id: "salesforce", label: "Salesforce" },
      { id: "aws", label: "AWS" },
      { id: "google_cloud", label: "Google Cloud" },
      { id: "openai", label: "OpenAI" },
      { id: "pytorch", label: "PyTorch" },
      { id: "tensorflow", label: "TensorFlow" },
      { id: "other", label: "Other" }
    ]
  },
  {
    id: 7,
    title: "What's your investment timeline?",
    type: "single",
    options: [
      { id: "short", label: "Short-term (1–6 months)" },
      { id: "medium", label: "Medium-term (6–12 months)" },
      { id: "long", label: "Long-term (12+ months)" }
    ]
  }
];

export const PreferenceQuestionnaire = ({ onComplete }: { onComplete: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const { toast } = useToast();

  const handleNext = async () => {
    if (!answers[questions[currentQuestion].id]) {
      toast({
        title: "Please select an option",
        description: "You need to select at least one option to continue.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion === questions.length - 1) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Map answers to preference structure with proper array handling
        const preferences = {
          preferred_industries: Array.isArray(answers[1]) ? answers[1] : [answers[1]],
          min_investment: answers[2] === 'under_10k' ? 0 : 10000,
          max_investment: answers[2] === 'over_100k' ? 1000000 : 100000,
          risk_appetite: [answers[3]], // Single value wrapped in array
          preferred_categories: Array.isArray(answers[4]) ? answers[4] : [answers[4]],
          technical_expertise: answers[5] as string,
          required_integrations: Array.isArray(answers[6]) ? answers[6] : [answers[6]],
          investment_timeline: answers[7] as string,
          current_question: questions.length
        };

        console.log('Saving preferences:', preferences);

        const { error } = await supabase
          .from('investor_preferences')
          .upsert({ 
            user_id: user.id,
            ...preferences
          });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        toast({
          title: "Preferences saved!",
          description: "Your investment preferences have been updated.",
        });

        onComplete();
      } catch (error) {
        console.error('Error saving preferences:', error);
        toast({
          title: "Error",
          description: "Failed to save your preferences. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
  };

  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const question = questions[currentQuestion];

  return (
    <Card className="p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4">{question.title}</h3>
          
          {question.type === "single" ? (
            <RadioGroup
              value={answers[question.id] as string}
              onValueChange={value => handleAnswer(value)}
              className="space-y-3"
            >
              {question.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {question.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={(answers[question.id] as string[] || []).includes(option.id)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[question.id] as string[] || [];
                      const newAnswers = checked
                        ? [...currentAnswers, option.id]
                        : currentAnswers.filter(id => id !== option.id);
                      handleAnswer(newAnswers);
                    }}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
              onClick={handleNext}
            >
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
