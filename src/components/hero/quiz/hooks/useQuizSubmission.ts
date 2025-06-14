
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
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
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

      console.log("Successfully stored in database, now adding contact to Brevo list");
      
      // Get stored answers from localStorage for contact properties
      const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
      
      // Create contact properties with the valuation data
      const contactProperties = {
        NAME: formData.name,
        COMPANY: formData.company || 'Not Provided',
        SELLING_INTEREST: formData.sellingInterest ? 'Yes' : 'No',
        ESTIMATED_VALUE_LOW: valuationResult?.estimatedValue?.low || 0,
        ESTIMATED_VALUE_HIGH: valuationResult?.estimatedValue?.high || 0,
        AI_CATEGORY: getAICategory(storedAnswers[3]),
        USER_COUNT: getUserCount(storedAnswers[2]),
        GROWTH_RATE: getGrowthRate(storedAnswers[4]),
        MARKET_POSITION: getMarketPosition(storedAnswers[5]),
        MRR: getMRR(storedAnswers[1]),
        BUSINESS_STAGE: getBusinessStage(storedAnswers[0]),
        TEAM_IP: getTeamIP(storedAnswers[6]),
        FUNDING_STATUS: getFundingStatus(storedAnswers[7]),
        SOURCE: 'ai_saas_valuation_quiz',
        QUIZ_DATE: new Date().toISOString()
      };

      console.log("Adding contact to Brevo list #7 with properties:", contactProperties);

      // Call simplified Brevo edge function to add contact to list
      const brevoResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          email: formData.email,
          contactProperties
        })
      });

      console.log("Brevo edge function response:", brevoResponse);
      
      if (brevoResponse.error) {
        console.error("Brevo edge function error:", brevoResponse.error);
        toast({
          title: "Success, your free valuation report is ready!",
          description: "Note: There was an issue adding you to our contact list.",
          variant: "default"
        });
      } else if (!brevoResponse.data?.success) {
        console.error("Brevo edge function returned failure:", brevoResponse.data);
        toast({
          title: "Success, your free valuation report is ready!",
          description: brevoResponse.data?.warning || "Note: There was an issue with the contact list.",
          variant: "default"
        });
      } else {
        console.log("Successfully added contact to Brevo list");
        toast({
          title: "Success, your free valuation report is ready!",
          description: ""
        });
      }
      
      // Show results regardless of Brevo status
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

function getMarketPosition(answer: number): string {
  const positions = {
    2: 'Many Competitors',
    3: 'Some Competition',
    4: 'Limited Competition',
    5: 'Market Leader'
  };
  return positions[answer as keyof typeof positions] || 'Unknown';
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

function getBusinessStage(answer: number): string {
  const stages = {
    1: 'Idea/Concept',
    2: 'MVP/Beta',
    3: 'Early Revenue',
    4: 'Growth Stage',
    5: 'Mature/Scale'
  };
  return stages[answer as keyof typeof stages] || 'Unknown';
}

function getTeamIP(answer: number): string {
  const teams = {
    2: 'Solo/Small Team',
    3: 'Small Experienced Team',
    4: 'Strong Technical Team',
    5: 'World-class Team'
  };
  return teams[answer as keyof typeof teams] || 'Unknown';
}

function getFundingStatus(answer: number): string {
  const funding = {
    1: 'Bootstrapped',
    2: 'Friends & Family',
    3: 'Seed Round',
    4: 'Series A',
    5: 'Series B+'
  };
  return funding[answer as keyof typeof funding] || 'Unknown';
}
