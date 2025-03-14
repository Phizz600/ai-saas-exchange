
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  agreedToTerms: boolean;
  setAgreedToTerms: (checked: boolean) => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
}

export const TermsCheckbox = ({ 
  agreedToTerms, 
  setAgreedToTerms, 
  isLoading, 
  isGoogleLoading 
}: TermsCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={agreedToTerms}
        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        className="border-white/30 data-[state=checked]:bg-[#D946EE] data-[state=checked]:border-[#D946EE]"
        disabled={isLoading || isGoogleLoading}
      />
      <label
        htmlFor="terms"
        className="text-sm text-white/90 cursor-pointer"
      >
        I agree to the Terms of Service and Privacy Policy
      </label>
    </div>
  );
};
