
import { useState } from 'react';
import { FormData } from '../types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateQuizValuation } from '../utils/valuationCalculator';

export const useQuizSubmission = () => {
  const [showResults, setShowResults] = useState(false);
  const [showValuationResults, setShowValuationResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    sellingInterest: true
  });
  const { toast } = useToast();

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Calculate valuation during the loading phase
  const calculateValuation = async () => {
    try {
      setIsLoading(true);
      // Get stored answers from localStorage
      const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      
      // Calculate valuation based on quiz answers
      const result = await calculateQuizValuation(answers);
      
      setValuationResult(result);
      setIsLoading(false);
      setShowValuationResults(true);
    } catch (error) {
      console.error("Error calculating valuation:", error);
      toast({
        title: "Error",
        description: "There was a problem calculating your valuation. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const proceedToContactForm = () => {
    setShowValuationResults(false);
    setShowResults(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email and name
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Please enter your name to receive your valuation.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address to receive your valuation.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Get stored answers from localStorage
      const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');

      // Create contact in Brevo, add to list, and track event
      const eventTrackingResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          mode: 'track_event_api',
          eventName: 'quiz_completed',
          identifiers: { 
            email_id: formData.email 
          },
          contactProperties: {
            NAME: formData.name,
            COMPANY: formData.company,
            SELLING_INTEREST: formData.sellingInterest,
            ESTIMATED_VALUE_LOW: valuationResult.estimatedValue.low,
            ESTIMATED_VALUE_HIGH: valuationResult.estimatedValue.high,
            INSIGHTS: valuationResult.insights.join('\n'),
            RECOMMENDATIONS: valuationResult.recommendations.join('\n'),
            QUIZ_ANSWERS: JSON.stringify(answers),
            SOURCE: 'quiz_valuation',
            CONFIDENCE_SCORE: valuationResult.confidenceScore,
            AI_CATEGORY: answers[1] || 'unknown',
            USER_COUNT: answers[3] || 'unknown',
            GROWTH_RATE: answers[4] || 'unknown',
            MARKET_TREND: answers[5] || 'unknown'
          },
          eventProperties: {
            source: 'ai_saas_valuation_quiz',
            company: formData.company || 'Not Provided',
            valuation_range: `$${valuationResult.estimatedValue.low} - $${valuationResult.estimatedValue.high}`,
            confidence_score: valuationResult.confidenceScore
          }
        })
      });

      console.log("Quiz submission and list addition response:", eventTrackingResponse);
      
      if (eventTrackingResponse.error) {
        throw new Error(eventTrackingResponse.error.message || 'Failed to process submission');
      }
      
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
    } finally {
      setIsLoading(false);
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
    handleSubmit,
    valuationResult,
    setValuationResult,
    calculateValuation,
    showValuationResults,
    setShowValuationResults,
    proceedToContactForm
  };
};
