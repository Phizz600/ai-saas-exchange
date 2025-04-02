import { supabase, storage, PRODUCT_IMAGES_BUCKET } from "@/integrations/supabase/client";
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

      // Add console.log for debugging image upload attempts
      console.log("Attempting to upload image to bucket:", PRODUCT_IMAGES_BUCKET);

      const { error: uploadError } = await storage
        .from(PRODUCT_IMAGES_BUCKET)
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

      // Use the correct way to build the image URL for Vite
      const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxadbwlidclnfoodjtpd.supabase.co';
      imageUrl = `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${filePath}`;
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
      // Remove industry_other as it doesn't exist in DB schema
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
      requires_nda: formData.requires_nda === true, // Ensure boolean value
      nda_content: formData.nda_content,
    };

    // Add console.log to debug NDA fields
    console.log("Product submission - NDA fields:", {
      requires_nda: formData.requires_nda,
      nda_content: formData.nda_content
    });

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

// Add handleProductSubmission function for the ListProductForm
export const handleProductSubmission = async (
  data: ListProductFormData,
  setIsSubmitting: (isSubmitting: boolean) => void
): Promise<{ success: boolean; productId?: string; error?: string }> => {
  try {
    setIsSubmitting(true);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to list a product" };
    }
    
    let imageUrl = null;
    if (data.image) {
      const fileExt = data.image.name.split(".").pop();
      const imageName = `${generateUniqueId()}.${fileExt}`;
      const filePath = `products/${imageName}`;

      // Debug log for NDA settings
      console.log("Form Data NDA settings:", {
        requires_nda: data.requires_nda,
        nda_content: data.nda_content
      });

      // Log the bucket name being used
      console.log("Uploading to bucket:", PRODUCT_IMAGES_BUCKET);

      const { error: uploadError } = await storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(filePath, data.image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error", uploadError);
        return { success: false, error: "Failed to upload image. Please try again." };
      }

      // Use the correct way to build the image URL for Vite
      const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxadbwlidclnfoodjtpd.supabase.co';
      imageUrl = `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${filePath}`;
    }
    
    // Prepare product data - removing is_auction and related fields that don't exist in DB
    const productData = {
      title: data.title,
      description: data.description,
      price: Number(data.price || 0),
      category: data.category,
      category_other: data.categoryOther,
      stage: data.stage,
      industry: data.industry,
      industry_other: data.industryOther,
      monthly_revenue: Number(data.monthlyRevenue || 0),
      monthly_traffic: Number(data.monthlyTraffic || 0),
      active_users: data.activeUsers,
      gross_profit_margin: Number(data.grossProfitMargin || 0),
      image_url: imageUrl,
      seller_id: user.id,
      tech_stack: data.techStack ? [data.techStack] : [],
      tech_stack_other: data.techStackOther,
      team_size: data.teamSize,
      has_patents: data.hasPatents || false,
      competitors: data.competitors,
      demo_url: data.demoUrl,
      is_verified: data.isVerified || false,
      special_notes: data.specialNotes,
      status: "pending",
      // Removing is_auction field and related auction fields
      business_type: data.businessType,
      deliverables: data.deliverables || [],
      monthly_profit: Number(data.monthlyProfit || 0),
      monthly_churn_rate: Number(data.monthlyChurnRate || 0),
      customer_acquisition_cost: Number(data.customerAcquisitionCost || 0),
      monetization: data.monetization,
      monetization_other: data.monetizationOther,
      business_model: data.businessModel,
      investment_timeline: data.investmentTimeline,
      llm_type: data.llmType,
      llm_type_other: data.llmTypeOther,
      integrations_other: data.integrations_other,
      product_age: data.productAge,
      business_location: data.businessLocation,
      number_of_employees: data.numberOfEmployees,
      product_link: data.productLink,
      requires_nda: data.requires_nda === true, // Ensure boolean value
      nda_content: data.nda_content || null,
    };
    
    // Additional debug logs
    console.log("Final product data - NDA fields:", {
      requires_nda: productData.requires_nda,
      nda_content: productData.nda_content
    });
    
    // Submit the product to the database
    const { data: newProduct, error } = await supabase
      .from("products")
      .insert([productData])
      .select();
      
    if (error) {
      console.error("Product submission error:", error);
      return { success: false, error: "Failed to submit product. Please try again." };
    }
    
    return { 
      success: true, 
      productId: newProduct?.[0]?.id
    };
    
  } catch (error: any) {
    console.error("Product submission error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred. Please try again."
    };
  } finally {
    setIsSubmitting(false);
  }
};

// Add handleProductUpdate function for the EditProductDialog
export const handleProductUpdate = async (
  productId: string, 
  data: Partial<ListProductFormData>,
  setIsSubmitting: (isSubmitting: boolean) => void
): Promise<boolean> => {
  try {
    setIsSubmitting(true);
    
    // Prepare the update object
    const updateData: any = {
      title: data.title,
      description: data.description,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      stage: data.stage,
      industry: data.industry,
      industry_other: data.industryOther,
      monthly_revenue: data.monthlyRevenue ? Number(data.monthlyRevenue) : undefined,
      monthly_profit: data.monthlyProfit ? Number(data.monthlyProfit) : undefined,
      gross_profit_margin: data.grossProfitMargin ? Number(data.grossProfitMargin) : undefined,
      monthly_churn_rate: data.monthlyChurnRate ? Number(data.monthlyChurnRate) : undefined,
      monthly_traffic: data.monthlyTraffic ? Number(data.monthlyTraffic) : undefined,
      active_users: data.activeUsers,
      tech_stack: data.techStack ? [data.techStack] : undefined,
      tech_stack_other: data.techStackOther,
      team_size: data.teamSize,
      has_patents: data.hasPatents,
      competitors: data.competitors,
      demo_url: data.demoUrl,
      product_age: data.productAge,
      business_location: data.businessLocation,
      special_notes: data.specialNotes,
      number_of_employees: data.numberOfEmployees,
      customer_acquisition_cost: data.customerAcquisitionCost ? Number(data.customerAcquisitionCost) : undefined,
      monetization: data.monetization !== 'other' ? data.monetization : undefined,
      monetization_other: data.monetization === 'other' ? data.monetizationOther : undefined,
      updated_at: new Date().toISOString(),
      // Ensure NDA fields are properly included
      requires_nda: data.requires_nda !== undefined ? data.requires_nda === true : undefined,
      nda_content: data.nda_content,
    };
    
    // Log NDA fields for debugging
    console.log("Product update - NDA fields:", {
      requires_nda: updateData.requires_nda,
      nda_content: updateData.nda_content
    });
    
    // Filter out undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);
      
    if (error) {
      console.error("Product update error:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  } finally {
    setIsSubmitting(false);
  }
};
