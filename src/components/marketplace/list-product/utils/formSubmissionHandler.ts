
import { supabase } from "@/integrations/supabase/client";
import { ListProductFormData } from "../types";
import { toast } from "@/hooks/use-toast";

const getTrafficValue = (range: string): number => {
  const upperBound = range.split('-')[1] || range;
  return parseInt(upperBound.replace(/,/g, ''));
};

export const handleProductSubmission = async (
  data: ListProductFormData,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  try {
    setIsLoading(true);
    console.log('Submitting product data:', data);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to list a product",
        variant: "destructive"
      });
      return false;
    }

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
          throw uploadError;
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
        return false;
      }
    } else {
      console.log("No image to upload");
    }

    const monthlyTrafficValue = data.monthlyTraffic ? getTrafficValue(data.monthlyTraffic) : 0;

    const auctionEndTime = data.auctionEndTime ? new Date(data.auctionEndTime).toISOString() : null;

    // Handle all "Other" fields
    const finalCategory = data.category === 'other' ? data.categoryOther?.toLowerCase().replace(/\s+/g, '_') : data.category;
    const finalIndustry = data.industry === 'Other' ? data.industryOther : data.industry;
    const finalTechStack = data.techStack === 'Other' ? [] : [data.techStack];
    const finalLlmType = data.llmType === 'Other' ? null : data.llmType;
    const finalMonetization = data.monetization === 'other' ? data.monetizationOther : data.monetization;

    const productData = {
      title: data.title,
      description: data.description,
      price: data.isAuction ? data.startingPrice : data.price || 0,
      category: finalCategory,
      category_other: data.category === 'other' ? data.categoryOther : null,
      stage: data.stage,
      industry: finalIndustry,
      industry_other: data.industry === 'Other' ? data.industryOther : null,
      monthly_revenue: data.monthlyRevenue || 0,
      monthly_profit: data.monthlyProfit || 0,
      gross_profit_margin: data.grossProfitMargin || 0,
      monthly_churn_rate: data.monthlyChurnRate || 0,
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
      customer_acquisition_cost: data.customerAcquisitionCost || 0,
      monetization: finalMonetization,
      monetization_other: data.monetization === 'other' ? data.monetizationOther : null,
      business_model: data.businessModel,
      investment_timeline: data.investmentTimeline,
      business_type: data.businessType,
      deliverables: data.deliverables,
      payment_status: 'pending',
      status: 'pending',
      updated_at: new Date().toISOString(),
      ...(data.isAuction && {
        auction_end_time: auctionEndTime,
        starting_price: data.startingPrice || 0,
        current_price: data.startingPrice || 0,
        min_price: data.minPrice || 0,
        price_decrement: data.priceDecrement || 0,
        price_decrement_interval: data.priceDecrementInterval
      })
    };

    console.log('Product data being sent to Supabase:', productData);

    const { data: insertedProduct, error } = await supabase
      .from('products')
      .insert(productData)
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Product Submitted Successfully!",
      description: "Proceeding to payment page...",
      duration: 3000,
    });

    // Redirect to Stripe payment page
    window.location.href = "https://buy.stripe.com/9AQ3dz3lmf2yccE288";

    return true;
  } catch (error) {
    console.error('Error submitting product:', error);
    toast({
      title: "Error",
      description: "Failed to list your product. Please try again.",
      variant: "destructive",
    });
    return false;
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
      category: data.category === 'other' ? data.categoryOther?.toLowerCase().replace(/\s+/g, '_') : data.category,
      category_other: data.category === 'other' ? data.categoryOther : null
    } : {};

    const industryUpdate = data.industry ? {
      industry: data.industry === 'Other' ? data.industryOther : data.industry,
      industry_other: data.industry === 'Other' ? data.industryOther : null
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

    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.price && { price: data.price }),
      ...(data.productLink !== undefined && { product_link: data.productLink }),
      ...categoryUpdate,
      ...industryUpdate,
      ...(data.stage && { stage: data.stage }),
      ...(data.monthlyRevenue && { monthly_revenue: data.monthlyRevenue }),
      ...(data.monthlyProfit && { monthly_profit: data.monthlyProfit }),
      ...(data.grossProfitMargin && { gross_profit_margin: data.grossProfitMargin }),
      ...(data.monthlyChurnRate && { monthly_churn_rate: data.monthlyChurnRate }),
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
      ...(data.customerAcquisitionCost && { customer_acquisition_cost: data.customerAcquisitionCost }),
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
