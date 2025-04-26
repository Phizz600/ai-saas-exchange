
import { useState } from 'react';
import { FormData } from '../types';
import { useToast } from "@/hooks/use-toast";

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
      // Here you would typically send the data to your backend
      console.log("Form submitted with data:", {
        ...formData
      });
      setShowConfirmation(true);
      toast({
        title: "Success!",
        description: "Your valuation has been sent to your email."
      });
    } catch (error) {
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
