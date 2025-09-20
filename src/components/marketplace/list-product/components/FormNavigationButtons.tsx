
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
  return <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 pt-6 border-t">
      <div className="flex items-center">
        {currentSection > 0 && <Button type="button" variant="outline" onClick={onPrevious} className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button type="button" variant="outline" onClick={onSaveForLater} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <Save className="h-4 w-4" />
          Save for later
        </Button>
        
        {currentSection < totalSections - 1 ? <Button type="button" onClick={e => {
        e.preventDefault();
        onNext();
      }} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#8B5CF6] hover:bg-violet-400 text-neutral-50">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button> : <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting Product..." : "Submit Product"}
          </Button>}
      </div>
    </div>;
}
