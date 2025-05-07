
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FormData } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResultsFormProps {
  formData: FormData;
  onFormChange: (formData: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResultsForm = ({ formData, onFormChange, onSubmit }: ResultsFormProps) => {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

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
    
    // Validate fields
    const newErrors: {name?: string; email?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, submit the form
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Get Your Full Valuation Report</h3>
        <p className="text-lg font-semibold text-[#6366f1] mb-4">
          Where should we send your personalized AI SaaS valuation?
        </p>
        <p className="text-gray-600">
          We'll email you a detailed valuation range based on current market conditions and your inputs, 
          along with next steps to list your business on the AI Exchange Club marketplace.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <Input
            type="text"
            placeholder="Your AI SaaS Company"
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
          />
        </div>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={formData.sellingInterest}
            onChange={e => handleChange('sellingInterest', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-600">
            I'm interested in exploring options to sell my AI SaaS business in the next 12 months
          </span>
        </label>
      </div>

      <Button type="submit" className="w-full bg-[#8b5cf6] hover:bg-[#7c4def]">
        <Send className="mr-2 h-4 w-4" /> Send My Detailed Report
      </Button>
    </form>
  );
};
