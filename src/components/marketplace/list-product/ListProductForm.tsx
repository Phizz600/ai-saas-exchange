
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
      isAuction: false, // Keep this for form state, even if DB doesn't have column yet
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
    try {
      setRedirecting(true);
      setSubmissionSuccess(true);
      
      toast({
        title: "Product submitted successfully!",
        description: "Redirecting to payment page in a moment...",
      });
      
      // Use a longer delay to ensure state updates and toast display
      setTimeout(() => {
        try {
          console.log("Redirecting to payment for product:", productId);
          // Use the FULL URL including protocol to ensure it works correctly
          const currentHost = window.location.origin;
          const successUrl = `${currentHost}/listing-thank-you?payment_status=success&product_id=${productId}`;
          window.location.href = `https://buy.stripe.com/9AQ3dz3lmf2yccE288?client_reference_id=${productId}&success_url=${encodeURIComponent(successUrl)}`;
        } catch (error) {
          console.error("Redirect error:", error);
          // Fallback if redirect fails
          navigate("/listing-thank-you?payment_needed=true&product_id=" + productId);
        }
      }, 3000);
    } catch (error) {
      console.error("Error in redirect handler:", error);
      toast({
        title: "Redirect Error",
        description: "There was a problem redirecting to the payment page. Please try again.",
        variant: "destructive",
      });
      setRedirecting(false);
      setSubmissionSuccess(false);
    }
  };

  const onSubmit = async (data: ListProductFormData) => {
    // Reset states
    setSubmissionError(null);
    
    // Validate agreements
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
      // Set loading state first to prevent multiple submissions
      setIsSubmitting(true);
      
      try {
        console.log("Starting product submission process...");
        
        // Submit product data and handle response
        const { success, productId, error } = await handleProductSubmission(data, setIsSubmitting);
        
        if (success && productId) {
          console.log("Product submitted successfully with ID:", productId);
          
          // Clean up draft after successful submission
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase
                .from('draft_products')
                .delete()
                .eq('user_id', user.id);
              
              console.log("Cleaned up draft products");
            }
          } catch (cleanupError) {
            console.error("Error cleaning up draft:", cleanupError);
            // Non-critical error, don't block the flow
          }
          
          // Set product ID in session storage as a backup
          sessionStorage.setItem('pendingProductId', productId);
          console.log("Session storage updated with product ID:", productId);
          
          // Trigger the payment redirect
          handleRedirectToPayment(productId);
        } else {
          // Handle submission failure
          console.error("Product submission failed:", error);
          setSubmissionError(error || "Failed to submit your product. Please try again.");
          setIsSubmitting(false);
          
          toast({
            title: "Submission Failed",
            description: error || "There was a problem submitting your product. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Unexpected error during submission:", error);
        setSubmissionError("An unexpected error occurred. Please try again or contact support.");
        setIsSubmitting(false);
        
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again or contact support.",
          variant: "destructive",
        });
      }
    } else {
      // Not on the last section, proceed to next section
      nextSection();
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
        <AlertDescription>
          {submissionError}
          <div className="mt-4">
            <button 
              onClick={() => setSubmissionError(null)} 
              className="bg-white text-destructive px-4 py-2 rounded font-medium hover:bg-gray-100"
            >
              Try Again
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Display success message if submission was successful but we're waiting for redirect
  if (submissionSuccess) {
    return (
      <Alert className="mb-6 bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>Your product has been submitted successfully. Redirecting to payment page...</p>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-progress rounded-full"></div>
          </div>
        </AlertDescription>
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
