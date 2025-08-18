
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowRight } from "lucide-react";
import { FormData } from "./types";

interface ResultsFormProps {
  formData: FormData;
  onFormChange: (formData: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPreValuation?: boolean;
}

export const ResultsForm = ({ formData, onFormChange, onSubmit, isPreValuation = false }: ResultsFormProps) => {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear previous errors when component mounts
  useEffect(() => {
    setErrors({});
  }, []);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    // Clear error when user starts typing
    if (typeof value === 'string' && field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    onFormChange({ ...formData, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission attempted with data:", formData);
    
    // Validate fields
    const newErrors: {name?: string; email?: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Please enter your name";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (Object.keys(newErrors).length > 0) {
      console.log("Form validation failed with errors:", newErrors);
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, submit the form
    setIsSubmitting(true);
    try {
      onSubmit(e);
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">
          Get Your Free AI SaaS Valuation
        </h3>
        <p className="text-lg font-semibold text-[#6366f1] mb-4">
          Enter your details to see your personalized business valuation
        </p>
        <p className="text-gray-600">
          We'll calculate your AI SaaS business value based on your quiz answers and current market data, 
          then email you a detailed report with actionable insights.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className={errors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Address *</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Please use a valid email address - we'll send your detailed valuation report here
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <Input
            type="text"
            placeholder="Your AI SaaS Company (Optional)"
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={formData.sellingInterest}
            onChange={e => handleChange('sellingInterest', e.target.checked)}
            className="mt-1"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-600">
            I'm interested in exploring options to sell my AI SaaS business in the next 12 months
          </span>
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#8b5cf6] hover:bg-[#7c4def]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Processing..."
        ) : (
          <>Get My Free Valuation <ArrowRight className="ml-2 h-4 w-4" /></>
        )}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Your information is secure and will only be used to provide your valuation report and relevant business opportunities.
      </p>
    </form>
  );
};
