
import { useState } from 'react';
import { FormData } from '../types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useQuizSubmission = () => {
  const [showResults, setShowResults] = useState(false);
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
      // Track event via Brevo's Events API
      const eventTrackingResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          mode: 'track_event_api',
          eventName: 'quiz_completed',
          identifiers: { email: formData.email },
          contactProperties: {
            NAME: formData.name,
            COMPANY: formData.company,
            SELLING_INTEREST: formData.sellingInterest
          },
          eventProperties: {
            source: 'ai_saas_valuation_quiz',
            company: formData.company || 'Not Provided'
          }
        })
      });

      console.log("Quiz submission event tracking response:", eventTrackingResponse);
      
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
    formData,
    setFormData,
    handleSubmit
  };
};
