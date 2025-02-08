
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FormNavigationButtonsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}

export function FormNavigationButtons({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  isSubmitting
}: FormNavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      {currentSection > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
      )}
      
      {currentSection < totalSections - 1 ? (
        <Button
          type="button"
          onClick={onNext}
          className="ml-auto flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          type="submit"
          className="ml-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#0EA4E9] text-white font-semibold py-3 px-6 rounded-lg transform transition-all duration-200 
          hover:opacity-90 shadow-[0_4px_0_rgb(42,98,143)] hover:shadow-[0_2px_0px_rgb(42,98,143)] 
          hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_0px_0px_rgb(42,98,143)]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Product..." : "Submit Product"}
        </Button>
      )}
    </div>
  );
}
