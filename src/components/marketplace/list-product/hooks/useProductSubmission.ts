
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListProductFormData } from "../types";
import { handleProductSubmission } from "../utils/formSubmissionHandler";
import { validateProductSubmission, logError } from "@/integrations/supabase/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProductSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRedirectToSuccess = (productId: string) => {
    try {
      setRedirecting(true);
      setSubmissionSuccess(true);
      
      toast.success("Product submitted successfully!");
      
      // Redirect to thank you page after a short delay to allow the toast to show
      setTimeout(() => {
        try {
          console.log("Redirecting to thank you page for product:", productId);
          navigate(`/listing-thank-you?product_id=${productId}`);
        } catch (error) {
          console.error("Redirect error:", error);
          logError("ListProductForm-Redirect", error, { productId });
          toast.error("Redirect failed. Please try refreshing the page.");
          setRedirecting(false);
          setSubmissionSuccess(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Error in redirect handler:", error);
      logError("ListProductForm-RedirectHandler", error, { productId });
      setRedirecting(false);
      setSubmissionSuccess(false);
    }
  };

  const validateForm = (data: ListProductFormData) => {
    return validateProductSubmission(data);
  };

  const cleanupDraft = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('draft_products')
          .delete()
          .eq('user_id', user.id);
        
        console.log("Cleaned up draft products");
      }
    } catch (error) {
      console.error("Error cleaning up draft:", error);
    }
  };

  const submitProduct = async (data: ListProductFormData): Promise<{
    success: boolean;
    productId?: string;
    error?: string;
  }> => {
    setIsSubmitting(true);
    
    try {
      console.log("Starting product submission process...");
      
      // Make sure noReserve is set correctly based on reservePrice
      if (data.isAuction) {
        data.noReserve = data.reservePrice === 0;
        console.log("Setting noReserve flag:", data.noReserve, "based on reservePrice:", data.reservePrice);
      }
      
      const result = await handleProductSubmission(data, setIsSubmitting);
      
      if (result.success && result.productId) {
        console.log("Product submitted successfully with ID:", result.productId);
        
        // Clean up draft after successful submission
        await cleanupDraft();
        
        // Set product ID in session storage as a backup
        sessionStorage.setItem('pendingProductId', result.productId);
        console.log("Session storage updated with product ID:", result.productId);
        
        return result;
      } else {
        console.error("Product submission failed:", result.error);
        logError("ListProductForm-Submission", new Error(result.error || "Submission failed"), data);
        return result;
      }
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      logError("ListProductForm-UnexpectedError", error, { formData: data });
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    redirecting,
    submissionSuccess,
    handleRedirectToSuccess,
    validateForm,
    submitProduct
  };
};
