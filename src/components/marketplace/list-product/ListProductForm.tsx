
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; 
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function ListProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
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

  const handleRedirectToPayment = (productId: string) => {
    setRedirecting(true);
    setSubmissionSuccess(true);
    
    toast({
      title: "Product submitted successfully!",
      description: "Redirecting to payment page in a moment...",
    });
    
    // Ensure we properly delay the redirect to allow for state updates and toast display
    setTimeout(() => {
      // Clear localStorage/sessionStorage to avoid confusion on future submissions
      try {
        console.log("Redirecting to payment for product:", productId);
        window.location.href = `https://buy.stripe.com/9AQ3dz3lmf2yccE288?client_reference_id=${productId}`;
      } catch (error) {
        console.error("Redirect error:", error);
        // Fallback if redirect fails
        navigate("/listing-thank-you?payment_needed=true");
      }
    }, 2000);
  };

  const onSubmit = async (data: ListProductFormData) => {
    console.log("Form submitted with data:", data);
    
    // Reset error state on new submission
    setSubmissionError(null);
    
    if (!data.accuracyAgreement || !data.termsAgreement) {
      toast({
        title: "Agreement Required",
        description: "Please accept both the accuracy statement and terms & conditions before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!data.title || !data.description || !data.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields in the Basics section.",
        variant: "destructive",
      });
      handleSectionClick(0); // Go back to the basics section
      return;
    }

    // Image validation
    if (!data.image) {
      toast({
        title: "Image Required",
        description: "Please upload a product logo image.",
        variant: "destructive",
      });
      handleSectionClick(0); // Go back to the basics section
      return;
    }

    if (currentSection === sections.length - 1) {
      setIsSubmitting(true);
      
      try {
        console.log("Proceeding with submission...");
        const success = await handleProductSubmission(data, setIsSubmitting);
        
        if (success) {
          // Clean up draft after successful submission
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('draft_products')
              .delete()
              .eq('user_id', user.id);
            
            console.log("Cleaned up draft products");
          }
          
          // Get product ID from session storage and redirect to payment
          const productId = sessionStorage.getItem('pendingProductId');
          console.log("Retrieved product ID from session storage:", productId);
          
          if (productId) {
            handleRedirectToPayment(productId);
          } else {
            // Fallback if ID is not found
            console.error("No product ID found in session storage");
            setSubmissionError("Product was saved but ID is missing. Please contact support.");
            setIsSubmitting(false);
          }
        } else {
          setSubmissionError("Failed to submit your product. Please try again.");
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Submission error:", error);
        setSubmissionError("An unexpected error occurred. Please try again or contact support.");
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

  // Display error alert if there's a submission error
  if (submissionError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{submissionError}</AlertDescription>
      </Alert>
    );
  }

  // Display success message if submission was successful but we're waiting for redirect
  if (submissionSuccess) {
    return (
      <Alert className="mb-6 bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>Your product has been submitted successfully. Redirecting to payment page...</AlertDescription>
      </Alert>
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
          isSubmitting={isSubmitting || redirecting}
        />
      </form>
    </Form>
  );
}
