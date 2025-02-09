
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { TechnicalSection } from "./form-sections/TechnicalSection";
import { TrafficSection } from "./form-sections/TrafficSection";
import { SpecialNotesSection } from "./form-sections/SpecialNotesSection";
import { FormProgressBar } from "./form-sections/FormProgressBar";
import { FormNavigationButtons } from "./components/FormNavigationButtons";
import { useFormNavigation } from "./hooks/useFormNavigation";
import { handleProductSubmission } from "./utils/formSubmissionHandler";
import { Form } from "@/components/ui/form";
import { ListProductFormData } from "./types";

export function ListProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sections = [
    { id: 0, title: "Basics", component: BasicInfoSection },
    { id: 1, title: "Financials", component: FinancialSection },
    { id: 2, title: "Technical", component: TechnicalSection },
    { id: 3, title: "Traffic", component: TrafficSection },
    { id: 4, title: "Special Notes", component: SpecialNotesSection },
  ];

  const form = useForm<ListProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category: "",
      stage: "",
      industry: "",
      monthlyRevenue: undefined,
      monthlyTraffic: "",
      activeUsers: "",
      grossProfitMargin: undefined,
      image: null,
      techStack: "",
      techStackOther: "",
      teamSize: "",
      hasPatents: false,
      competitors: "",
      demoUrl: "",
      isVerified: false,
      specialNotes: "",
    },
  });

  const { currentSection, handleSectionClick, nextSection, previousSection } = 
    useFormNavigation(sections.length);

  const onSubmit = async (data: ListProductFormData) => {
    // Only process submission if we're on the last section
    if (currentSection === sections.length - 1) {
      const success = await handleProductSubmission(data, setIsLoading);
      if (success) {
        navigate("/listing-thank-you");
      }
    }
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormProgressBar 
          currentSection={currentSection} 
          onSectionClick={handleSectionClick}
        />
        
        <div className="space-y-8 min-h-[400px]">
          <CurrentSectionComponent form={form} />
        </div>

        <FormNavigationButtons
          currentSection={currentSection}
          totalSections={sections.length}
          onPrevious={previousSection}
          onNext={nextSection}
          isSubmitting={isLoading}
        />
      </form>
    </Form>
  );
}
