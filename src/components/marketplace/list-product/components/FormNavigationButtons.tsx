
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface FormNavigationButtonsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveForLater: () => void;
  isSubmitting: boolean;
}

export function FormNavigationButtons({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSaveForLater,
  isSubmitting
}: FormNavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <div className="flex items-center gap-2">
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
        <Button
          type="button"
          variant="outline"
          onClick={onSaveForLater}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save for later
        </Button>
      </div>
      
      {currentSection < totalSections - 1 ? (
        <Button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          type="submit"
          className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#0EA4E9] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Product..." : "Submit Product"}
        </Button>
      )}
    </div>
  );
}

