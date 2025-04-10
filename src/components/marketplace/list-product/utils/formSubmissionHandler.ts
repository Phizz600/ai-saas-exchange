import { supabase, storage, PRODUCT_IMAGES_BUCKET } from "@/integrations/supabase/client";
import { ListProductFormData } from "../types";
import { generateUniqueId } from "@/lib/utils";
import { sendListingNotification } from "@/integrations/supabase/functions";

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
      price: formData.price ? Math.max(1, Number(formData.price)) : null, // Ensure minimum price of 1
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
      starting_price: formData.isAuction ? Math.max(1, Number(formData.startingPrice || 1)) : null,
      reserve_price: formData.isAuction ? Math.max(1, Number(formData.reservePrice || 1)) : null, // Changed from min_price to reserve_price
      price_decrement: formData.isAuction ? Math.max(1, Number(formData.priceDecrement || 1)) : null,
      price_decrement_interval: formData.priceDecrementInterval,
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
      no_reserve: formData.noReserve === true, // Add no_reserve field
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
    
    // Send submission confirmation email
    try {
      // Get user details for personalized email
      const { data: userData } = await supabase.auth.getUser();
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, full_name')
        .eq('id', user_id)
        .single();
      
      const userFirstName = profileData?.first_name || profileData?.full_name?.split(' ')[0] || '';
      const userEmail = userData?.user?.email || '';
      
      if (userEmail) {
        await sendListingNotification(
          'submitted',
          userEmail,
          formData.title,
          userFirstName
        );
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the submission if email fails
    }
    
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
    // Add proper check for image existence before processing
    if (data.image && data.image instanceof File) {
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
    } else {
      // Log missing image for debugging
      console.warn("No image provided or image is not a valid File object");
      return { success: false, error: "Please upload a product image." };
    }
    
    // Calculate price based on auction or fixed price
    let finalPrice = data.isAuction ? Math.max(1, Number(data.startingPrice)) : Math.max(1, Number(data.price));
    
    // Set current_price initially equal to price or starting_price
    const currentPrice = data.isAuction ? Math.max(1, Number(data.startingPrice)) : Math.max(1, Number(data.price));
    
    // Prepare product data - remove is_auction field and use database-compatible fields
    const productData = {
      title: data.title,
      description: data.description,
      price: Math.max(1, Number(data.price || 1)), // Ensure minimum price of 1
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
      // Handle auction specific fields - use the actual database column names
      auction_status: data.isAuction ? "pending" : null,
      starting_price: data.isAuction ? Math.max(1, Number(data.startingPrice || 1)) : null,
      reserve_price: data.isAuction ? Math.max(1, Number(data.reservePrice || 1)) : null, // Changed from min_price to reserve_price
      price_decrement: data.isAuction ? Math.max(1, Number(data.priceDecrement || 1)) : null,
      price_decrement_interval: data.isAuction ? data.priceDecrementInterval : null,
      auction_end_time: data.isAuction && data.auctionEndTime ? data.auctionEndTime.toISOString() : null,
      current_price: currentPrice, // Add current price field
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
      no_reserve: data.noReserve === true, // Add no_reserve field
    };
    
    // Additional debug logs
    console.log("Final product data - Price fields:", {
      price: productData.price,
      starting_price: productData.starting_price,
      reserve_price: productData.reserve_price,
      current_price: productData.current_price
    });
    
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
    
    // Send confirmation email
    try {
      // Get user details for personalized email
      const { data: userData } = await supabase.auth.getUser();
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, full_name')
        .eq('id', user.id)
        .single();
      
      const userFirstName = profileData?.first_name || profileData?.full_name?.split(' ')[0] || '';
      const userEmail = userData?.user?.email || '';
      
      if (userEmail) {
        await sendListingNotification(
          'submitted',
          userEmail,
          data.title,
          userFirstName
        );
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the submission if email fails
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
      price: data.price ? Math.max(1, Number(data.price)) : undefined, // Ensure minimum price of 1
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
