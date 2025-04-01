import { supabase, storage } from "@/integrations/supabase/client";
import { ListProductFormData } from "../types";
import { generateUniqueId } from "@/lib/utils";

export const submitProductForm = async (
  formData: ListProductFormData,
  user_id: string,
  router: any,
  storage: any,
  setIsSubmitting: (isSubmitting: boolean) => void,
  toast: any,
  resetForm: () => void,
  draftId?: string
): Promise<boolean> => {
  if (!formData) {
    console.error("Form data is undefined");
    return false;
  }

  try {
    setIsSubmitting(true);

    let imageUrl = null;
    if (formData.image) {
      const fileExt = formData.image.name.split(".").pop();
      const imageName = `${generateUniqueId()}.${fileExt}`;
      const filePath = `products/${imageName}`;

      const { error: uploadError } = await storage
        .from("lovable-uploads")
        .upload(filePath, formData.image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error", uploadError);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return false;
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lovable-uploads/${filePath}`;
    }

    // Prepare the product data for submission
    const productData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price || 0),
      category: formData.category,
      category_other: formData.categoryOther,
      stage: formData.stage,
      industry: formData.industry,
      industry_other: formData.industryOther,
      monthly_revenue: Number(formData.monthlyRevenue || 0),
      monthly_traffic: Number(formData.monthlyTraffic || 0),
      active_users: formData.activeUsers,
      gross_profit_margin: Number(formData.grossProfitMargin || 0),
      image_url: imageUrl,
      seller_id: user_id,
      tech_stack: formData.techStack ? [formData.techStack] : [],
      tech_stack_other: formData.techStackOther,
      team_size: formData.teamSize,
      has_patents: formData.hasPatents || false,
      competitors: formData.competitors,
      demo_url: formData.demoUrl,
      is_verified: formData.isVerified || false,
      special_notes: formData.specialNotes,
      status: "pending",
      is_auction: formData.isAuction || false,
      starting_price: formData.isAuction ? Number(formData.startingPrice || 0) : null,
      min_price: formData.isAuction ? Number(formData.minPrice || 0) : null,
      price_decrement: formData.isAuction ? Number(formData.priceDecrement || 0) : null,
      price_decrement_interval: formData.isAuction ? formData.priceDecrementInterval : null,
      auction_end_time: formData.isAuction && formData.auctionEndTime ? formData.auctionEndTime.toISOString() : null,
      auction_status: formData.isAuction ? "pending" : null,
      business_type: formData.businessType,
      deliverables: formData.deliverables || [],
      monthly_profit: Number(formData.monthlyProfit || 0),
      monthly_churn_rate: Number(formData.monthlyChurnRate || 0),
      customer_acquisition_cost: Number(formData.customerAcquisitionCost || 0),
      monetization: formData.monetization,
      monetization_other: formData.monetizationOther,
      business_model: formData.businessModel,
      investment_timeline: formData.investmentTimeline,
      llm_type: formData.llmType,
      llm_type_other: formData.llmTypeOther,
      integrations_other: formData.integrations_other,
      product_age: formData.productAge,
      business_location: formData.businessLocation,
      number_of_employees: formData.numberOfEmployees,
      product_link: formData.productLink,
      requires_nda: formData.requires_nda || false,
      nda_content: formData.nda_content,
    };

    // Submit the product data to Supabase
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()

    if (error) {
      console.error("Supabase submission error", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit product. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return false;
    }

    // If draftId is provided, delete the draft
    if (draftId) {
      const { error: deleteError } = await supabase
        .from("product_drafts")
        .delete()
        .eq("id", draftId);

      if (deleteError) {
        console.error("Error deleting draft:", deleteError);
        toast({
          title: "Error Deleting Draft",
          description: "Failed to delete the draft. Please try again.",
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Success",
      description: "Product submitted successfully!",
    });
    resetForm();
    router.push("/marketplace");
    return true;
  } catch (error: any) {
    console.error("Form submission failed", error);
    toast({
      title: "Submission Error",
      description: error.message || "Failed to submit product. Please try again.",
      variant: "destructive",
    });
    return false;
  } finally {
    setIsSubmitting(false);
  }
};
