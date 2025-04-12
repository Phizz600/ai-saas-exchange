
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; 
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle } from "lucide-react";
import { logError, validateProductSubmission } from "@/integrations/supabase/products";
import { Button } from "@/components/ui/button";

export function ListProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
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
      isAuction: false, // Keep this for form state
      startingPrice: undefined,
      reservePrice: undefined, // Changed from minPrice to reservePrice
      priceDecrement: undefined,
      priceDecrementInterval: "day", // Changed default to daily
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
      auctionDuration: "30days", // Updated default auction duration
      noReserve: false, // Initialize noReserve field
      monthlyExpenses: [], // Initialize empty array for monthly expenses
    },
  });

  const reservePrice = form.watch("reservePrice");
  useEffect(() => {
    // If reservePrice is 0 or undefined, set noReserve to true
    if (reservePrice === 0) {
      form.setValue("noReserve", true);
    } else if (reservePrice !== undefined) {
      form.setValue("noReserve", false);
    }
  }, [reservePrice, form]);

  const { currentSection, handleSectionClick, nextSection, previousSection } = 
    useFormNavigation(sections.length);

  const { isLoading, saveForLater } = useAutosave(form, currentSection);

  // Function to clear all errors
  const clearErrors = () => {
    setSubmissionError(null);
    setFormErrors({});
  };

  const handleRedirectToPayment = (productId: string) => {
    try {
      setRedirecting(true);
      setSubmissionSuccess(true);
      
      toast.success("Product submitted successfully! Redirecting to payment page...");
      
      // Use a longer delay to ensure state updates and toast display
      setTimeout(() => {
        try {
          console.log("Redirecting to payment for product:", productId);
          // Use the FULL URL including protocol to ensure it works correctly
          const currentHost = window.location.origin;
          const successUrl = `${currentHost}/listing-thank-you?payment_status=success&product_id=${productId}`;
          console.log("Redirect URL:", `https://buy.stripe.com/9AQ3dz3lmf2yccE288?client_reference_id=${productId}&success_url=${encodeURIComponent(successUrl)}`);
          
          window.location.href = `https://buy.stripe.com/9AQ3dz3lmf2yccE288?client_reference_id=${productId}&success_url=${encodeURIComponent(successUrl)}`;
        } catch (error) {
          // Log the error for debugging
          logError("ListProductForm-Redirect", error, { productId });
          console.error("Redirect error:", error);
          
          // Fallback if redirect fails
          toast.error("Redirect failed. Navigating to thank you page...");
          navigate("/listing-thank-you?payment_needed=true&product_id=" + productId);
        }
      }, 3000);
    } catch (error) {
      console.error("Error in redirect handler:", error);
      logError("ListProductForm-RedirectHandler", error, { productId });
      
      toast.error("There was a problem redirecting to the payment page. Please try again.");
      setRedirecting(false);
      setSubmissionSuccess(false);
    }
  };

  const onSubmit = async (data: ListProductFormData) => {
    // Reset states
    clearErrors();
    setSubmissionAttempted(true);
    
    // Run client-side form validation first
    const validation = validateProductSubmission(data);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      
      // Find first section with error and navigate to it
      const errorFields = Object.keys(validation.errors);
      
      if (errorFields.includes('title') || errorFields.includes('description') || 
          errorFields.includes('category') || errorFields.includes('image')) {
        handleSectionClick(0); // Basics
        toast.error("Please fix the errors in the Basics section");
      }
      else if (errorFields.includes('price')) {
        handleSectionClick(1); // Financials
        toast.error("Please fix the errors in the Financials section");
      }
      else if (errorFields.includes('startingPrice') || errorFields.includes('reservePrice') || 
              errorFields.includes('priceDecrement') || errorFields.includes('auctionDuration')) {
        handleSectionClick(5); // Selling Method
        toast.error("Please fix the errors in the Selling Method section");
      }
      else if (errorFields.includes('accuracyAgreement') || errorFields.includes('termsAgreement')) {
        handleSectionClick(5); // Selling Method (where agreements are)
        toast.error("You must accept the agreements before submitting");
      }
      
      return;
    }

    if (currentSection === sections.length - 1) {
      // Set loading state first to prevent multiple submissions
      setIsSubmitting(true);
      
      try {
        console.log("Starting product submission process...");
        
        // Validate authentication first
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setSubmissionError("Authentication error: " + sessionError.message);
          setIsSubmitting(false);
          toast.error("Authentication Error", {
            description: "Please sign in to submit your product"
          });
          return;
        }
        
        if (!sessionData.session) {
          setSubmissionError("You must be signed in to list a product");
          setIsSubmitting(false);
          toast.error("Authentication Required", {
            description: "Please sign in to submit your product",
            action: {
              label: "Sign In",
              onClick: () => navigate("/auth?redirect=/list-product")
            }
          });
          return;
        }
        
        // Make sure noReserve is set correctly based on reservePrice
        if (data.isAuction) {
          data.noReserve = data.reservePrice === 0;
          console.log("Setting noReserve flag:", data.noReserve, "based on reservePrice:", data.reservePrice);
        }
        
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
          logError("ListProductForm-Submission", new Error(error || "Submission failed"), data);
          
          setSubmissionError(error || "Failed to submit your product. Please try again.");
          setIsSubmitting(false);
          
          toast.error("Submission Failed", {
            description: error || "There was a problem submitting your product. Please try again.",
          });
        }
      } catch (error) {
        console.error("Unexpected error during submission:", error);
        logError("ListProductForm-UnexpectedError", error, { formData: data });
        
        setSubmissionError("An unexpected error occurred. Please try again or contact support.");
        setIsSubmitting(false);
        
        toast.error("Unexpected Error", {
          description: "An unexpected error occurred. Please try again or contact support.",
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
      <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Submission Failed</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{submissionError}</p>
          <div className="mt-4 space-x-4">
            <Button 
              onClick={() => setSubmissionError(null)} 
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => {
                saveForLater();
                toast.success("Progress saved. You can return to this later.");
              }}
              variant="ghost"
            >
              Save for Later
            </Button>
            <Button 
              onClick={() => {
                window.open("https://calendly.com/aiexchangeclub/listing-walkthrough", "_blank");
              }}
              variant="default"
            >
              Get Help
            </Button>
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

  // Display field-level errors if any exist
  const hasErrors = Object.keys(formErrors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormProgressBar 
          currentSection={currentSection} 
          onSectionClick={handleSectionClick}
        />
        
        {hasErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Form Validation Errors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {submissionAttempted && !hasErrors && submissionError === null && !submissionSuccess && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Submission Tips</AlertTitle>
            <AlertDescription>
              <p>Please ensure all required fields are filled and that you have:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Uploaded a valid product image (JPG, PNG, or WebP format)</li>
                <li>Provided a unique product title</li>
                <li>Completed all required fields in each section</li>
                <li>Accepted the terms and agreements in the final section</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
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
