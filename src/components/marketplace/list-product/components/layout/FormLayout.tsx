
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ListProductFormData } from "../../types";
import { FormNavigationButtons } from "../FormNavigationButtons";
import { FormProgressBar } from "../../form-sections/FormProgressBar";
import { FormErrorAlert } from "../alerts/FormErrorAlert";
import { FormSubmissionTips } from "../alerts/FormSubmissionTips";
import { SubmissionAgreements } from "../../form-sections/SubmissionAgreements";

interface FormLayoutProps {
  form: UseFormReturn<ListProductFormData>;
  currentSection: number;
  totalSections: number;
  onSubmit: (data: ListProductFormData) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSaveForLater: () => void;
  onSectionClick: (section: number) => void;
  isSubmitting: boolean;
  redirecting: boolean;
  children: ReactNode;
  formErrors: Record<string, string>;
  submissionAttempted: boolean;
  hasErrors: boolean;
  showAgreements: boolean;
}

export const FormLayout = ({
  form,
  currentSection,
  totalSections,
  onSubmit,
  onPrevious,
  onNext,
  onSaveForLater,
  onSectionClick,
  isSubmitting,
  redirecting,
  children,
  formErrors,
  submissionAttempted,
  hasErrors,
  showAgreements
}: FormLayoutProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormProgressBar 
          currentSection={currentSection} 
          onSectionClick={onSectionClick}
        />
        
        {hasErrors && <FormErrorAlert errors={formErrors} />}
        
        {submissionAttempted && !hasErrors && <FormSubmissionTips />}
        
        <div className="space-y-8 min-h-[400px]">
          {children}
          {showAgreements && <SubmissionAgreements form={form} />}
        </div>

        <FormNavigationButtons
          currentSection={currentSection}
          totalSections={totalSections}
          onPrevious={onPrevious}
          onNext={onNext}
          onSaveForLater={onSaveForLater}
          isSubmitting={isSubmitting || redirecting}
        />
      </form>
    </Form>
  );
};
