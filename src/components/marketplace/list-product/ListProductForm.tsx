
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { TechnicalSection } from "./form-sections/TechnicalSection";
import { TrafficSection } from "./form-sections/TrafficSection";
import { AuctionSection } from "./form-sections/AuctionSection";
import { SpecialNotesSection } from "./form-sections/SpecialNotesSection";
import { SubmissionAgreements } from "./form-sections/SubmissionAgreements";
import { FormProgressBar } from "./form-sections/FormProgressBar";
import { FormNavigationButtons } from "./components/FormNavigationButtons";
import { useFormNavigation } from "./hooks/useFormNavigation";
import { handleProductSubmission } from "./utils/formSubmissionHandler";
import { Form } from "@/components/ui/form";
import { ListProductFormData } from "./types";
import { useAutosave } from "./hooks/useAutosave";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function ListProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sections = [
    { id: 0, title: "Basics", component: BasicInfoSection },
    { id: 1, title: "Financials", component: FinancialSection },
    { id: 2, title: "Technical", component: TechnicalSection },
    { id: 3, title: "Traffic", component: TrafficSection },
    { id: 4, title: "Special Notes", component: SpecialNotesSection },
    { id: 5, title: "Selling Method", component: AuctionSection },
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
      isAuction: false,
      startingPrice: undefined,
      minPrice: undefined,
      priceDecrement: undefined,
      priceDecrementInterval: "minute",
      techStack: "",
      techStackOther: "",
      teamSize: "",
      hasPatents: false,
      competitors: "",
      demoUrl: "",
      isVerified: false,
      specialNotes: "",
      accuracyAgreement: false,
      termsAgreement: false,
      deliverables: [],
      productLink: "",
    },
  });

  const { currentSection, handleSectionClick, nextSection, previousSection } = 
    useFormNavigation(sections.length);

  const { isLoading, saveForLater } = useAutosave(form, currentSection);

  const onSubmit = async (data: ListProductFormData) => {
    if (!data.accuracyAgreement || !data.termsAgreement) {
      toast({
        title: "Agreement Required",
        description: "Please accept both the accuracy statement and terms & conditions before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (currentSection === sections.length - 1) {
      setIsSubmitting(true);
      try {
        const success = await handleProductSubmission(data, setIsSubmitting);
        if (success) {
          // Clean up draft after successful submission
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('draft_products')
              .delete()
              .eq('user_id', user.id);
          }
          navigate("/listing-thank-you");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const CurrentSectionComponent = sections[currentSection].component;
  const showAgreements = currentSection === 5; // Only show agreements in Selling Method section

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormProgressBar 
          currentSection={currentSection} 
          onSectionClick={handleSectionClick}
        />
        
        <div className="space-y-8 min-h-[400px]">
          <CurrentSectionComponent form={form} />
          {showAgreements && <SubmissionAgreements form={form} />}
        </div>

        <FormNavigationButtons
          currentSection={currentSection}
          totalSections={sections.length}
          onPrevious={previousSection}
          onNext={nextSection}
          onSaveForLater={saveForLater}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}
