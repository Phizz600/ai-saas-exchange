
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FormData } from "./types";

interface ResultsFormProps {
  formData: FormData;
  onFormChange: (formData: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResultsForm = ({ formData, onFormChange, onSubmit }: ResultsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Your Valuation is Ready!</h3>
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
            onChange={e => onFormChange({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={e => onFormChange({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <Input
            type="text"
            placeholder="Your AI SaaS Company"
            value={formData.company}
            onChange={e => onFormChange({ ...formData, company: e.target.value })}
          />
        </div>

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={formData.sellingInterest}
            onChange={e => onFormChange({ ...formData, sellingInterest: e.target.checked })}
            className="mt-1"
          />
          <span className="text-sm text-gray-600">
            I'm interested in exploring options to sell my AI SaaS business in the next 12 months
          </span>
        </label>
      </div>

      <Button type="submit" className="w-full bg-[#8b5cf6] hover:bg-[#7c4def]">
        <Send className="mr-2 h-4 w-4" /> Send My Valuation
      </Button>
    </form>
  );
};
