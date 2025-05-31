
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
      const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      console.log("Retrieved quiz answers:", storedAnswers);
      
      // Calculate valuation based on quiz answers
      const result = await calculateQuizValuation(storedAnswers);
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
        const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
        console.log("Retrieved quiz answers:", storedAnswers);
        
        // Calculate valuation based on quiz answers
        const result = await calculateQuizValuation(storedAnswers);
        console.log("Calculated valuation result:", result);
        setValuationResult(result);
      }
      
      // Store in local database first
      console.log("Storing data in local valuation_leads table");
      const { error: dbError } = await supabase
        .from('valuation_leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          quiz_answers: JSON.parse(localStorage.getItem('quizAnswers') || '{}')
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log("Successfully stored in database, now calling Brevo edge function");
      
      // Get stored answers from localStorage for contact properties
      const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      
      // Map quiz answers to meaningful data
      const answerMapping = {
        0: 'business_stage',
        1: 'mrr',
        2: 'customers',
        3: 'ai_technology',
        4: 'growth_rate',
        5: 'market_position',
        6: 'team_ip',
        7: 'funding_status'
      };

      // Create contact properties with all the valuation data
      const contactProperties = {
        NAME: formData.name,
        COMPANY: formData.company || 'Not Provided',
        SELLING_INTEREST: formData.sellingInterest ? 'Yes' : 'No',
        ESTIMATED_VALUE_LOW: valuationResult?.estimatedValue?.low || 0,
        ESTIMATED_VALUE_HIGH: valuationResult?.estimatedValue?.high || 0,
        INSIGHTS: valuationResult?.insights?.join(' | ') || '',
        RECOMMENDATIONS: valuationResult?.recommendations?.join(' | ') || '',
        CONFIDENCE_SCORE: valuationResult?.confidenceScore || 50,
        AI_CATEGORY: getAICategory(storedAnswers[3]),
        USER_COUNT: getUserCount(storedAnswers[2]),
        GROWTH_RATE: getGrowthRate(storedAnswers[4]),
        MARKET_TREND: getMarketTrend(storedAnswers[5]),
        MRR: getMRR(storedAnswers[1]),
        REVENUE_SCORE: valuationResult?.metrics?.revenueScore || 0,
        GROWTH_SCORE: valuationResult?.metrics?.growthScore || 0,
        MARKET_SCORE: valuationResult?.metrics?.marketScore || 0,
        USER_SCORE: valuationResult?.metrics?.userScore || 0,
        OVERALL_SCORE: valuationResult?.metrics?.overallScore || 0,
        IMPROVEMENT_AREAS: JSON.stringify(valuationResult?.improvementAreas || []),
        SOURCE: 'ai_saas_valuation_quiz',
        QUIZ_DATE: new Date().toISOString()
      };

      console.log("Calling Brevo edge function with contact properties:", contactProperties);

      // Call Brevo edge function to add contact to list #7 and send valuation email
      const brevoResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          mode: 'track_event_api',
          eventName: 'quiz_completed',
          identifiers: { 
            email: formData.email
          },
          contactProperties,
          eventProperties: {
            source: 'ai_saas_valuation_quiz',
            company: formData.company || 'Not Provided',
            valuation_range: `$${valuationResult?.estimatedValue?.low || 0} - $${valuationResult?.estimatedValue?.high || 0}`,
            confidence_score: valuationResult?.confidenceScore || 50,
            quiz_completion_date: new Date().toISOString()
          }
        })
      });

      console.log("Brevo edge function response:", brevoResponse);
      
      if (brevoResponse.error) {
        console.error("Brevo edge function error:", brevoResponse.error);
        // Don't throw here - we want to show results even if email fails
        toast({
          title: "Warning",
          description: "Your valuation was calculated but there was an issue sending the email. Your data has been saved.",
          variant: "default"
        });
      } else if (!brevoResponse.data?.success) {
        console.error("Brevo edge function returned failure:", brevoResponse.data);
        toast({
          title: "Warning", 
          description: "Your valuation was calculated but there was an issue with email delivery. Your data has been saved.",
          variant: "default"
        });
      } else {
        console.log("Successfully called Brevo edge function");
        toast({
          title: "Success!",
          description: "Your valuation has been calculated and sent to your email!"
        });
      }
      
      // Show results regardless of email status
      if (!showValuationResults) {
        setShowValuationResults(true);
        setShowResults(false);
      } else {
        setShowConfirmation(true);
      }
      
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: `There was a problem processing your submission: ${error.message || "Unknown error"}. Please try again.`,
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

// Helper functions to map quiz answers to readable values
function getAICategory(answer: number): string {
  const categories = {
    3: 'Machine Learning',
    4: 'Natural Language Processing', 
    5: 'Computer Vision',
    6: 'Process Automation',
    7: 'Generative AI',
    2: 'Other/Multiple'
  };
  return categories[answer as keyof typeof categories] || 'Unknown';
}

function getUserCount(answer: number): string {
  const counts = {
    0: '0',
    25: '1-50',
    75: '51-100', 
    300: '101-500',
    750: '500-1,000',
    3000: '1,000-5,000',
    10000: '10,000+'
  };
  return counts[answer as keyof typeof counts] || 'Unknown';
}

function getGrowthRate(answer: number): string {
  const rates = {
    1: 'Declining/No Growth',
    2: '0-5%',
    3: '5-15%',
    4: '15-30%', 
    5: '30%+'
  };
  return rates[answer as keyof typeof rates] || 'Unknown';
}

function getMarketTrend(answer: number): string {
  const trends = {
    2: 'Crowded Market',
    3: 'Moderate Competition',
    4: 'Limited Competition',
    5: 'Market Leader'
  };
  return trends[answer as keyof typeof trends] || 'Unknown';
}

function getMRR(answer: number): string {
  const mrr = {
    0: '$0',
    1000: '$1-$1,000',
    5000: '$1,001-$10,000',
    25000: '$10,001-$50,000',
    100000: '$50,001-$200,000',
    500000: '$200,000+'
  };
  return mrr[answer as keyof typeof mrr] || 'Unknown';
}
