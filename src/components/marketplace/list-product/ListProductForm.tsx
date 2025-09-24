
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListProductForm } from "./hooks/useListProductForm";
import { useFormSections } from "./hooks/useFormSections";
import { useAuthenticationCheck } from "./hooks/useAuthenticationCheck";
import { useProductSubmission } from "./hooks/useProductSubmission";
import { useAutosave } from "./hooks/useAutosave";
import { Skeleton } from "@/components/ui/skeleton";
import { FormErrorAlert } from "./components/alerts/FormErrorAlert";
import { FormSubmissionError } from "./components/alerts/FormSubmissionError";
import { FormSubmissionSuccess } from "./components/alerts/FormSubmissionSuccess";
import { FormLayout } from "./components/layout/FormLayout";
import { ListProductFormData } from "./types";
import { PackagePaymentDialog } from "@/components/payments/PackagePaymentDialog";
import { toast } from "sonner";

interface ListProductFormProps {
  selectedPackage?: 'free-listing' | 'featured-listing' | 'premium-exit' | null;
}

export function ListProductForm({ selectedPackage }: ListProductFormProps) {
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [pendingSubmissionData, setPendingSubmissionData] = useState<ListProductFormData | null>(null);
  
  // Custom hooks
  const {
    form,
    isSubmitting, 
    setIsSubmitting,
    redirecting, 
    setRedirecting,
    submissionError, 
    setSubmissionError,
    formErrors, 
    setFormErrors,
    submissionSuccess, 
    setSubmissionSuccess,
    submissionAttempted, 
    setSubmissionAttempted,
    clearErrors
  } = useListProductForm();

  const { 
    sections, 
    currentSection, 
    handleSectionClick, 
    nextSection, 
    previousSection 
  } = useFormSections();

  const { 
    checkAuthentication 
  } = useAuthenticationCheck();

  const { 
    handleRedirectToSuccess,
    validateForm,
    submitProduct
  } = useProductSubmission();

  const { isLoading, saveForLater } = useAutosave(form, currentSection);

  const handlePaymentSuccess = async () => {
    if (!pendingSubmissionData) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit product data after successful payment
      const { success, productId, error } = await submitProduct(pendingSubmissionData);
      
      if (success && productId) {
        // Clear package selection and pending data
        localStorage.removeItem('selectedPackage');
        setPendingSubmissionData(null);
        setShowPaymentDialog(false);
        
        // Trigger the success redirect
        handleRedirectToSuccess(productId);
      } else {
        // Handle submission failure
        setSubmissionError(error || "Failed to submit your product after payment. Please contact support.");
        setIsSubmitting(false);
        setShowPaymentDialog(false);
        
        toast.error("Submission Failed", {
          description: "Payment was successful but product submission failed. Please contact support.",
        });
      }
    } catch (error) {
      console.error("Error submitting after payment:", error);
      setSubmissionError("An unexpected error occurred after payment. Please contact support.");
      setIsSubmitting(false);
      setShowPaymentDialog(false);
    }
  };

  const handleContinueWithFree = async () => {
    if (!pendingSubmissionData) return;
    
    setIsSubmitting(true);
    
    try {
      // Modify the submission data to use free-listing package
      const freeSubmissionData = {
        ...pendingSubmissionData,
        selectedPackage: 'free-listing' as const
      };
      
      // Submit product data with free package
      const { success, productId, error } = await submitProduct(freeSubmissionData);
      
      if (success && productId) {
        // Update package selection and clear pending data
        localStorage.setItem('selectedPackage', 'free-listing');
        setPendingSubmissionData(null);
        setShowPaymentDialog(false);
        
        toast.success('Your product has been listed with the free package!');
        
        // Trigger the success redirect
        handleRedirectToSuccess(productId);
      } else {
        // Handle submission failure
        setSubmissionError(error || "Failed to submit your product. Please try again.");
        setIsSubmitting(false);
        setShowPaymentDialog(false);
        setPendingSubmissionData(null);
      }
    } catch (error) {
      console.error("Error in free submission:", error);
      setSubmissionError("An error occurred while submitting. Please try again.");
      setIsSubmitting(false);
      setShowPaymentDialog(false);
      setPendingSubmissionData(null);
    }
  };

  const onSubmit = async (data: ListProductFormData) => {
    // Reset states
    clearErrors();
    setSubmissionAttempted(true);
    
    // Run client-side form validation first
    const validation = validateForm(data);
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
        // Validate authentication first
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
          setIsSubmitting(false);
          return;
        }
        
        // Check if premium package requires payment
        if (selectedPackage && (selectedPackage === 'featured-listing' || selectedPackage === 'premium-exit')) {
          // Store submission data and show payment dialog
          setPendingSubmissionData(data);
          setShowPaymentDialog(true);
          setIsSubmitting(false);
          return;
        }
        
        // For starter package or no package selected, proceed with normal submission
        const { success, productId, error } = await submitProduct(data);
        
        if (success && productId) {
          // Clear package selection from localStorage
          localStorage.removeItem('selectedPackage');
          // Trigger the success redirect
          handleRedirectToSuccess(productId);
        } else {
          // Handle submission failure
          setSubmissionError(error || "Failed to submit your product. Please try again.");
          setIsSubmitting(false);
          
          toast.error("Submission Failed", {
            description: error || "There was a problem submitting your product. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error in submission flow:", error);
        setSubmissionError("An unexpected error occurred. Please try again or contact support.");
        setIsSubmitting(false);
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
      <FormSubmissionError 
        error={submissionError} 
        onClear={() => setSubmissionError(null)}
        onSaveForLater={saveForLater}
      />
    );
  }

  // Display success message if submission was successful but we're waiting for redirect
  if (submissionSuccess) {
    return <FormSubmissionSuccess />;
  }

  const CurrentSectionComponent = sections[currentSection].component;
  const showAgreements = currentSection === 5; // Only show agreements in Selling Method section

  // Display field-level errors if any exist
  const hasErrors = Object.keys(formErrors).length > 0;

  return (
    <>
      <FormLayout
        form={form}
        currentSection={currentSection}
        totalSections={sections.length}
        onSubmit={onSubmit}
        onPrevious={previousSection}
        onNext={nextSection}
        onSaveForLater={saveForLater}
        onSectionClick={handleSectionClick}
        isSubmitting={isSubmitting}
        redirecting={redirecting}
        formErrors={formErrors}
        submissionAttempted={submissionAttempted}
        hasErrors={hasErrors}
        showAgreements={showAgreements}
      >
        <CurrentSectionComponent form={form} />
      </FormLayout>

      {/* Package Payment Dialog */}
      {showPaymentDialog && selectedPackage && (selectedPackage === 'featured-listing' || selectedPackage === 'premium-exit') && (
        <PackagePaymentDialog
          open={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false);
            setPendingSubmissionData(null);
            setIsSubmitting(false);
          }}
          packageType={selectedPackage}
          onSuccess={handlePaymentSuccess}
          onContinueWithFree={handleContinueWithFree}
        />
      )}
    </>
  );
}
