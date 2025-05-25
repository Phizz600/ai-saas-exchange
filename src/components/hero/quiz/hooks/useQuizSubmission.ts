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
  
  // Show the contact form first instead of calculating
  const proceedToContactForm = () => {
    setShowResults(true);
  };
  
  // Calculate valuation during the loading phase
  const calculateValuation = async () => {
    try {
      setIsLoading(true);
      console.log("Beginning valuation calculation");
      // Get stored answers from localStorage
      const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      console.log("Retrieved quiz answers:", answers);
      
      // Calculate valuation based on quiz answers
      const result = await calculateQuizValuation(answers);
      console.log("Calculated valuation result:", result);
      
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
      console.log("Starting form submission process with data:", {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        sellingInterest: formData.sellingInterest
      });
      
      // If we haven't calculated valuation yet, do it now
      if (!valuationResult) {
        console.log("No valuation result yet, calculating now...");
        // Get stored answers from localStorage
        const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
        console.log("Retrieved quiz answers:", answers);
        
        // Calculate valuation based on quiz answers
        const result = await calculateQuizValuation(answers);
        console.log("Calculated valuation result:", result);
        setValuationResult(result);
      }
      
      console.log("Preparing to send data to Brevo via edge function");
      // After we have both contact info and valuation, proceed with submission
      // Create contact in Brevo, add to list, and track event
      const eventTrackingResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          mode: 'track_event_api',
          eventName: 'quiz_completed',
          identifiers: { 
            email: formData.email // Changed from email_id to email to match Brevo API expectations
          },
          contactProperties: {
            NAME: formData.name,
            COMPANY: formData.company,
            SELLING_INTEREST: formData.sellingInterest,
            ESTIMATED_VALUE_LOW: valuationResult?.estimatedValue?.low,
            ESTIMATED_VALUE_HIGH: valuationResult?.estimatedValue?.high,
            INSIGHTS: valuationResult?.insights?.join('\n') || '',
            RECOMMENDATIONS: valuationResult?.recommendations?.join('\n') || '',
            QUIZ_ANSWERS: JSON.stringify(JSON.parse(localStorage.getItem('quizAnswers') || '{}')),
            SOURCE: 'quiz_valuation',
<<<<<<< HEAD
            CONFIDENCE_SCORE: valuationResult?.confidenceScore || 0,
            AI_CATEGORY: JSON.parse(localStorage.getItem('quizAnswers') || '{}')[1] || 'unknown',
            USER_COUNT: JSON.parse(localStorage.getItem('quizAnswers') || '{}')[3] || 'unknown',
            GROWTH_RATE: JSON.parse(localStorage.getItem('quizAnswers') || '{}')[4] || 'unknown',
            MARKET_TREND: JSON.parse(localStorage.getItem('quizAnswers') || '{}')[5] || 'unknown'
=======
            CONFIDENCE_SCORE: valuationResult.confidenceScore,
            AI_CATEGORY: answers[1] || 'unknown',
            USER_COUNT: answers[3] || 'unknown',
            GROWTH_RATE: answers[4] || 'unknown',
            MARKET_TREND: answers[5] || 'unknown',
            REVENUE_SCORE: valuationResult.metrics.revenueScore,
            GROWTH_SCORE: valuationResult.metrics.growthScore,
            MARKET_SCORE: valuationResult.metrics.marketScore,
            USER_SCORE: valuationResult.metrics.userScore,
            OVERALL_SCORE: valuationResult.metrics.overallScore,
            IMPROVEMENT_AREAS: JSON.stringify(valuationResult.improvementAreas)
>>>>>>> b7b8c81 (test - I changed the color of the 'Buy a SaaS'. Few other changes in regards to the quizpage)
          },
          eventProperties: {
            source: 'ai_saas_valuation_quiz',
            company: formData.company || 'Not Provided',
<<<<<<< HEAD
            valuation_range: valuationResult ? `$${valuationResult.estimatedValue.low} - $${valuationResult.estimatedValue.high}` : 'Unknown',
            confidence_score: valuationResult?.confidenceScore || 0
=======
            valuation_range: `$${valuationResult.estimatedValue.low} - $${valuationResult.estimatedValue.high}`,
            confidence_score: valuationResult.confidenceScore,
            overall_score: valuationResult.metrics.overallScore,
            improvement_areas: valuationResult.improvementAreas.map(area => area.area).join(', ')
>>>>>>> b7b8c81 (test - I changed the color of the 'Buy a SaaS'. Few other changes in regards to the quizpage)
          }
        })
      });

      console.log("Edge function response:", eventTrackingResponse);
      
      if (eventTrackingResponse.error) {
        console.error("Error from edge function:", eventTrackingResponse.error);
        throw new Error(eventTrackingResponse.error.message || 'Failed to process submission');
      }
      
      if (!eventTrackingResponse.data?.success) {
        console.error("Edge function returned failure:", eventTrackingResponse.data);
        throw new Error(eventTrackingResponse.data?.error || 'Failed to process submission');
      }
      
      console.log("Form submission successful, updating UI...");
      
      // If we haven't shown results yet, show them now
      if (!showValuationResults) {
        setShowValuationResults(true);
        setShowResults(false);
      } else {
        // If we've already shown results and they completed the form, show confirmation
        setShowConfirmation(true);
      }
      
      toast({
        title: "Success!",
        description: "Your valuation has been sent to your email."
      });
    } catch (error: any) {
      console.error("Error tracking quiz submission:", error);
      toast({
        title: "Error",
        description: `There was a problem sending your valuation: ${error.message || "Unknown error"}. Please try again.`,
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
