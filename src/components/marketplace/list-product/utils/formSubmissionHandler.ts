import { supabase } from "@/integrations/supabase/client";
import { ListProductFormData } from "../types";
import { toast } from "@/hooks/use-toast";

const getTrafficValue = (range: string): number => {
  const upperBound = range.split('-')[1] || range;
  return parseInt(upperBound.replace(/,/g, ''));
};

// Ensure price is a valid number
const validatePrice = (price: any): number | undefined => {
  if (price === undefined || price === null) return undefined;
  
  const numericPrice = typeof price === 'number' ? price : 
                       typeof price === 'string' ? parseFloat(price.replace(/[$,]/g, '')) : 
                       undefined;
                       
  return numericPrice && !isNaN(numericPrice) && numericPrice > 0 ? numericPrice : undefined;
};

export const handleProductSubmission = async (
  data: ListProductFormData,
  setIsLoading: (loading: boolean) => void
): Promise<{ success: boolean; productId?: string; error?: string }> => {
  try {
    setIsLoading(true);
    console.log('Submitting product data:', data);

    // Check authentication first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Authentication error:', authError);
      return { 
        success: false,
        error: "Authentication failed. Please log in again."
      };
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to list a product",
        variant: "destructive"
      });
      return { 
        success: false,
        error: "Authentication required. Please log in to list a product." 
      };
    }

    // Process image upload
    let image_url = null;
    if (data.image && data.image instanceof File) {
      console.log("Processing image upload:", data.image.name, data.image.type, data.image.size);
      
      try {
        const fileExt = data.image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = fileName;
        
        console.log("Uploading to path:", filePath);
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(filePath, data.image, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          return { 
            success: false,
            error: `Image upload failed: ${uploadError.message}`
          };
        }

        console.log("Upload successful:", uploadData);

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        console.log("Generated public URL:", publicUrl);
        image_url = publicUrl;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        toast({
          title: "Image Upload Failed",
          description: "There was a problem uploading your image. Please try again with a smaller image or different format.",
          variant: "destructive"
        });
        return { 
          success: false,
          error: "Image upload failed. Please try with a smaller image or different format."
        };
      }
    } else {
      console.log("No image to upload");
      return { 
        success: false,
        error: "Product image is required."
      };
    }

    const monthlyTrafficValue = data.monthlyTraffic ? getTrafficValue(data.monthlyTraffic) : 0;
    const auctionEndTime = data.auctionEndTime ? new Date(data.auctionEndTime).toISOString() : null;

    // Keep category as-is (no longer convert to snake_case)
    const finalCategory = data.category === 'Other' ? data.categoryOther : data.category;
    
    // Important: Remove the industry_other column usage as it seems to not exist in the schema
    const industryValue = data.industry === 'Other' ? data.industryOther : data.industry;
    
    const finalTechStack = data.techStack === 'Other' ? [] : [data.techStack];
    const finalLlmType = data.llmType === 'Other' ? null : data.llmType;
    const finalMonetization = data.monetization === 'other' ? data.monetizationOther : data.monetization;

    // Validate and process price fields
    const price = validatePrice(data.isAuction ? undefined : data.price);
    const startingPrice = validatePrice(data.isAuction ? data.startingPrice : undefined);
    const minPrice = validatePrice(data.isAuction ? data.minPrice : undefined);
    const priceDecrement = validatePrice(data.isAuction ? data.priceDecrement : undefined);
    
    // Price validation checks
    if (data.isAuction) {
      if (!startingPrice) {
        return {
          success: false,
          error: "Please provide a valid starting price for the auction."
        };
      }
      if (!minPrice) {
        return {
          success: false,
          error: "Please provide a valid minimum price for the auction."
        };
      }
      if (!priceDecrement) {
        return {
          success: false,
          error: "Please provide a valid price decrement amount."
        };
      }
    } else {
      if (!price) {
        return {
          success: false,
          error: "Please provide a valid price for your product."
        };
      }
    }

    // Build the product data object without industry_other field
    const productData = {
      title: data.title,
      description: data.description,
      price: data.isAuction ? startingPrice : price || 0,
      category: finalCategory,
      category_other: data.category === 'Other' ? data.categoryOther : null,
      stage: data.stage,
      industry: industryValue, // Use single field for industry
      monthly_revenue: validatePrice(data.monthlyRevenue) || 0,
      monthly_profit: validatePrice(data.monthlyProfit) || 0,
      gross_profit_margin: validatePrice(data.grossProfitMargin) || 0,
      monthly_churn_rate: validatePrice(data.monthlyChurnRate) || 0,
      monthly_traffic: monthlyTrafficValue,
      active_users: data.activeUsers,
      image_url,
      seller_id: user.id,
      tech_stack: finalTechStack,
      tech_stack_other: data.techStack === 'Other' ? data.techStackOther : null,
      llm_type: finalLlmType,
      llm_type_other: data.llmType === 'Other' ? data.llmTypeOther : null,
      integrations_other: data.integrations_other,
      team_size: data.teamSize,
      has_patents: data.hasPatents,
      competitors: data.competitors,
      demo_url: data.demoUrl,
      product_link: data.productLink || null,
      is_revenue_verified: data.isRevenueVerified || false,
      is_code_audited: data.isCodeAudited || false,
      is_traffic_verified: data.isTrafficVerified || false,
      product_age: data.productAge,
      business_location: data.businessLocation,
      special_notes: data.specialNotes,
      number_of_employees: data.numberOfEmployees,
      customer_acquisition_cost: validatePrice(data.customerAcquisitionCost) || 0,
      monetization: finalMonetization,
      monetization_other: data.monetization === 'other' ? data.monetizationOther : null,
      business_model: data.businessModel,
      investment_timeline: data.investmentTimeline,
      business_type: data.businessType,
      deliverables: data.deliverables,
      payment_status: 'pending',
      status: 'pending',
      updated_at: new Date().toISOString()
    };

    // Add auction-specific fields if applicable
    if (data.isAuction) {
      Object.assign(productData, {
        auction_end_time: auctionEndTime,
        starting_price: startingPrice || 0,
        current_price: startingPrice || 0,
        min_price: minPrice || 0,
        price_decrement: priceDecrement || 0,
        price_decrement_interval: data.priceDecrementInterval
      });
    }

    console.log('Product data being sent to Supabase:', productData);

    try {
      // Insert the product data and get the ID back
      const { data: insertedProduct, error } = await supabase
        .from('products')
        .insert(productData)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return { 
          success: false,
          error: `Database error: ${error.message}`
        };
      }
      
      console.log("Product inserted successfully:", insertedProduct);

      if (!insertedProduct || !insertedProduct.id) {
        console.error("Missing product ID from inserted product");
        return { 
          success: false,
          error: "Product was created but ID is missing. Please contact support."
        };
      }

      // Store the product ID in session storage for retrieval after payment
      sessionStorage.setItem('pendingProductId', insertedProduct.id);
      console.log("Saved product ID to session storage:", insertedProduct.id);

      return {
        success: true,
        productId: insertedProduct.id
      };
    } catch (dbError) {
      console.error('Database error:', dbError);
      return { 
        success: false,
        error: "Database error. Please try again or contact support."
      };
    }
  } catch (error) {
    console.error('Error submitting product:', error);
    return { 
      success: false,
      error: "An unexpected error occurred. Please try again or contact support."
    };
  } finally {
    setIsLoading(false);
  }
};

export const handleProductUpdate = async (
  productId: string,
  data: Partial<ListProductFormData>,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  try {
    setIsLoading(true);
    console.log('Updating product data:', { productId, data });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update your product",
        variant: "destructive"
      });
      return false;
    }

    const { data: existingProduct } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single();

    if (!existingProduct || existingProduct.seller_id !== user.id) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to update this product",
        variant: "destructive"
      });
      return false;
    }

    const monthlyTrafficValue = data.monthlyTraffic ? getTrafficValue(data.monthlyTraffic) : undefined;

    // Process "Other" fields for the update
    const categoryUpdate = data.category ? {
      category: data.category === 'Other' ? data.categoryOther : data.category,
      category_other: data.category === 'Other' ? data.categoryOther : null
    } : {};

    // Update industry handling to avoid industry_other column
    const industryUpdate = data.industry ? {
      industry: data.industry === 'Other' ? data.industryOther : data.industry
    } : {};

    const techStackUpdate = data.techStack ? {
      tech_stack: data.techStack === 'Other' ? [] : [data.techStack],
      tech_stack_other: data.techStack === 'Other' ? data.techStackOther : null
    } : {};

    const llmTypeUpdate = data.llmType ? {
      llm_type: data.llmType === 'Other' ? null : data.llmType,
      llm_type_other: data.llmType === 'Other' ? data.llmTypeOther : null
    } : {};

    const monetizationUpdate = data.monetization ? {
      monetization: data.monetization === 'other' ? data.monetizationOther : data.monetization,
      monetization_other: data.monetization === 'other' ? data.monetizationOther : null
    } : {};

    // Validate price fields
    const price = validatePrice(data.price);
    const monthlyRevenue = validatePrice(data.monthlyRevenue);
    const monthlyProfit = validatePrice(data.monthlyProfit);
    const grossProfitMargin = validatePrice(data.grossProfitMargin);
    const monthlyChurnRate = validatePrice(data.monthlyChurnRate);
    const customerAcquisitionCost = validatePrice(data.customerAcquisitionCost);

    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(price !== undefined && { price }),
      ...(data.productLink !== undefined && { product_link: data.productLink }),
      ...categoryUpdate,
      ...industryUpdate,
      ...(data.stage && { stage: data.stage }),
      ...(monthlyRevenue !== undefined && { monthly_revenue: monthlyRevenue }),
      ...(monthlyProfit !== undefined && { monthly_profit: monthlyProfit }),
      ...(grossProfitMargin !== undefined && { gross_profit_margin: grossProfitMargin }),
      ...(monthlyChurnRate !== undefined && { monthly_churn_rate: monthlyChurnRate }),
      ...(monthlyTrafficValue && { monthly_traffic: monthlyTrafficValue }),
      ...(data.activeUsers && { active_users: data.activeUsers }),
      ...techStackUpdate,
      ...llmTypeUpdate,
      ...(data.integrations_other && { integrations_other: data.integrations_other }),
      ...(data.teamSize && { team_size: data.teamSize }),
      ...(typeof data.hasPatents !== 'undefined' && { has_patents: data.hasPatents }),
      ...(data.competitors && { competitors: data.competitors }),
      ...(data.demoUrl && { demo_url: data.demoUrl }),
      ...(data.productAge && { product_age: data.productAge }),
      ...(data.businessLocation && { business_location: data.businessLocation }),
      ...(data.specialNotes && { special_notes: data.specialNotes }),
      ...(data.numberOfEmployees && { number_of_employees: data.numberOfEmployees }),
      ...(customerAcquisitionCost !== undefined && { customer_acquisition_cost: customerAcquisitionCost }),
      ...monetizationUpdate,
      ...(data.businessType && { business_type: data.businessType }),
      ...(data.deliverables && { deliverables: data.deliverables }),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);

    if (error) throw error;

    toast({
      title: "Product Updated Successfully!",
      description: "Your product listing has been updated.",
      duration: 5000,
    });

    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    toast({
      title: "Error",
      description: "Failed to update your product. Please try again.",
      variant: "destructive",
    });
    return false;
  } finally {
    setIsLoading(false);
  }
};
