
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { TechnicalSection } from "./form-sections/TechnicalSection";
import { TrafficSection } from "./form-sections/TrafficSection";
import { AuctionSection } from "./form-sections/AuctionSection";
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
    { id: 4, title: "Dutch Auction", component: AuctionSection },
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
    },
  });

  const { currentSection, handleSectionClick, nextSection, previousSection } = 
    useFormNavigation(sections.length);

  const onSubmit = async (data: ListProductFormData) => {
    const success = await handleProductSubmission(data, setIsLoading);
    if (success) {
      navigate("/marketplace");
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
