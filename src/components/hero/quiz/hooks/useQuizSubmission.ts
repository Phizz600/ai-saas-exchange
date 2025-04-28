
import { useState } from 'react';
import { FormData } from '../types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateQuizValuation } from '../utils/valuationCalculator';

export const useQuizSubmission = () => {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    sellingInterest: true
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email to receive your valuation.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate valuation based on quiz answers
      const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      const valuationResult = await calculateQuizValuation(answers);

      // Create contact in Brevo, add to list, and track event
      const eventTrackingResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          mode: 'track_event_api',
          eventName: 'quiz_completed',
          identifiers: { email: formData.email },
          contactProperties: {
            NAME: formData.name,
            COMPANY: formData.company,
            SELLING_INTEREST: formData.sellingInterest,
            ESTIMATED_VALUE_LOW: valuationResult.estimatedValue.low,
            ESTIMATED_VALUE_HIGH: valuationResult.estimatedValue.high,
            INSIGHTS: valuationResult.insights.join('\n'),
            RECOMMENDATIONS: valuationResult.recommendations.join('\n'),
            QUIZ_ANSWERS: JSON.stringify(answers)
          },
          eventProperties: {
            source: 'ai_saas_valuation_quiz',
            company: formData.company || 'Not Provided',
            valuation_range: `$${valuationResult.estimatedValue.low} - $${valuationResult.estimatedValue.high}`
          }
        })
      });

      console.log("Quiz submission and list addition response:", eventTrackingResponse);
      
      if (!eventTrackingResponse.data?.success) {
        throw new Error(eventTrackingResponse.data?.error || 'Failed to process submission');
      }
      
      setShowConfirmation(true);
      toast({
        title: "Success!",
        description: "Your valuation has been sent to your email."
      });
    } catch (error) {
      console.error("Error tracking quiz submission:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your valuation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    showResults,
    setShowResults,
    showConfirmation,
    isLoading,
    setIsLoading,
    formData,
    setFormData,
    handleSubmit
  };
};
