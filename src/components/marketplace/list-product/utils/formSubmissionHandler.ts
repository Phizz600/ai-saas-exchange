import { ListProductFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/integrations/supabase/products";
import { sendListingNotification } from "@/integrations/supabase/functions";

// Helper function to convert traffic range string to numeric value (using the middle of the range)
const convertRangeToNumber = (rangeStr: string): number | null => {
  if (!rangeStr) return null;
  
  // Handle cases with a plus sign (e.g., "100,001+")
  if (rangeStr.includes('+')) {
    const baseValue = parseFloat(rangeStr.replace(/,/g, '').replace('+', ''));
    return baseValue;
  }
  
  // Handle range values (e.g., "5,001-10,000")
  if (rangeStr.includes('-')) {
    const [minStr, maxStr] = rangeStr.split('-');
    const min = parseFloat(minStr.replace(/,/g, ''));
    const max = parseFloat(maxStr.replace(/,/g, ''));
    // Use the middle value of the range
    return (min + max) / 2;
  }
  
  // Handle simple numbers
  return parseFloat(rangeStr.replace(/,/g, ''));
};

// Helper function to handle product submission
export const handleProductSubmission = async (
  data: ListProductFormData,
  setIsSubmitting: (loading: boolean) => void
): Promise<{
  success: boolean;
  productId?: string;
  error?: string;
}> => {
  try {
    console.log("Starting product submission process", data);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Convert traffic and users from range strings to numeric values if needed
    const monthlyTrafficValue = typeof data.monthlyTraffic === 'string'
      ? convertRangeToNumber(data.monthlyTraffic)
      : data.monthlyTraffic;

    // Convert tech stack to array if it's a string
    const techStackArray = typeof data.techStack === 'string' 
      ? [data.techStack] 
      : (Array.isArray(data.techStack) ? data.techStack : []);

    // Ensure price is always set for database constraints
    const productPrice = data.price && data.price > 0 ? data.price : 1;
    
    // Prepare the product data
    const productData = {
      title: data.title,
      description: data.description,
      price: productPrice, // Always set price field with a positive value
      category: data.category,
      stage: data.stage,
      industry: data.industry,
      monthly_revenue: data.monthlyRevenue,
      monthly_traffic: monthlyTrafficValue, // Use the converted numeric value
      active_users: data.activeUsers, // Keep as string for this field
      gross_profit_margin: data.grossProfitMargin, // Using the correct column name 'gross_profit_margin'
      monthly_churn_rate: data.monthlyChurnRate,
      tech_stack: techStackArray,
      tech_stack_other: data.techStackOther,
      team_size: data.teamSize,
      has_patents: data.hasPatents,
      competitors: data.competitors,
      demo_url: data.demoUrl,
      is_verified: data.isVerified,
      special_notes: data.specialNotes,
      listing_type: 'fixed_price',
      current_price: data.price,
      // Status and user fields
      status: "pending",
      seller_id: user.id, // Using the correct seller_id field
      payment_status: "pending",
      product_link: data.productLink,
    };

    // Insert the product data
    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (insertError || !insertedProduct) {
      console.error("Error inserting product:", insertError);
      return { success: false, error: insertError?.message || "Error creating product" };
    }

    // If an image was selected, upload it
    if (data.image && data.image.name) {
      try {
        const fileName = `product-${insertedProduct.id}-${Date.now()}.${data.image.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('product_images')
          .upload(fileName, data.image);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return { 
            success: true, 
            productId: insertedProduct.id,
            error: "Product created but image upload failed"
          };
        }

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase
          .storage
          .from('product_images')
          .getPublicUrl(fileName);

        // Update the product with the image URL
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('id', insertedProduct.id);

        if (updateError) {
          console.error("Error updating product with image URL:", updateError);
        }
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        // Continue with the process even if image upload fails
      }
    }

    // Send confirmation email to the user
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        // Get user profile to get first name
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', userData.user.id)
          .single();
          
        const firstName = profileData?.first_name || 'there';
        
        // Changed "submitted" to "pending" to match the allowed notification status types
        await sendListingNotification(
          'pending',
          userData.user.email!,
          data.title,
          firstName,
          undefined,
          insertedProduct.id
        );
        
        console.log("Submission confirmation email sent successfully");
      }
    } catch (emailError) {
      // Log but don't fail if email sending fails
      console.error("Error sending submission confirmation email:", emailError);
      logError("emailNotification", emailError as Error, { productId: insertedProduct.id });
    }

    console.log("Product successfully submitted with ID:", insertedProduct.id);
    return { success: true, productId: insertedProduct.id };
  } catch (error) {
    console.error("Unexpected error in product submission:", error);
    logError("handleProductSubmission", error as Error, { data });
    setIsSubmitting(false);
    return { success: false, error: "An unexpected error occurred" };
  } finally {
    setIsSubmitting(false);
  }
};


// Helper function to handle product update
export const handleProductUpdate = async (
  productId: string,
  data: Partial<ListProductFormData>,
  setIsSubmitting: (loading: boolean) => void
): Promise<boolean> => {
  try {
    console.log("Starting product update process", { productId, data });
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    // Convert traffic from range string to numeric value if needed
    const monthlyTrafficValue = data.monthlyTraffic && typeof data.monthlyTraffic === 'string'
      ? convertRangeToNumber(data.monthlyTraffic)
      : data.monthlyTraffic;

    // Convert tech stack to array if it's a string
    const techStackArray = data.techStack && typeof data.techStack === 'string'
      ? [data.techStack]
      : (Array.isArray(data.techStack) ? data.techStack : undefined);

    // Handle price consistently
    const productPrice = (data.price && data.price > 0) ? data.price : 1;
    
    // Prepare the product data for update
    const productData: Record<string, any> = {};
    
    // Map form fields to database fields
    if (data.title) productData.title = data.title;
    if (data.description) productData.description = data.description;
    productData.price = productPrice; // Always set price field
    if (data.category) productData.category = data.category;
    if (data.stage) productData.stage = data.stage;
    if (data.industry) productData.industry = data.industry;
    if (data.monthlyRevenue !== undefined) productData.monthly_revenue = data.monthlyRevenue;
    if (monthlyTrafficValue !== undefined) productData.monthly_traffic = monthlyTrafficValue;
    if (data.activeUsers) productData.active_users = data.activeUsers;
    if (data.grossProfitMargin !== undefined) productData.gross_profit_margin = data.grossProfitMargin;
    if (techStackArray) productData.tech_stack = techStackArray;
    if (data.techStackOther) productData.tech_stack_other = data.techStackOther;
    if (data.teamSize) productData.team_size = data.teamSize;
    if (data.hasPatents !== undefined) productData.has_patents = data.hasPatents;
    if (data.competitors) productData.competitors = data.competitors;
    if (data.demoUrl) productData.demo_url = data.demoUrl;
    if (data.specialNotes) productData.special_notes = data.specialNotes;
    if (data.productLink) productData.product_link = data.productLink;
    
    // For fixed price listings, update current_price with price
    if (data.price !== undefined) {
      productData.current_price = data.price;
    }
    productData.listing_type = 'fixed_price';
    
    // Update the product
    const { error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .eq('seller_id', user.id); // Using the correct seller_id field

    if (updateError) {
      console.error("Error updating product:", updateError);
      return false;
    }

    // If an image was selected, upload it
    if (data.image) {
      const fileName = `product-${productId}-${Date.now()}.${data.image.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('product_images')
        .upload(fileName, data.image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return true; // Product updated but image upload failed
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase
        .storage
        .from('product_images')
        .getPublicUrl(fileName);

      // Update the product with the image URL
      const { error: imageUpdateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId);

      if (imageUpdateError) {
        console.error("Error updating product with image URL:", imageUpdateError);
      }
    }

    console.log("Product successfully updated with ID:", productId);
    return true;
  } catch (error) {
    console.error("Unexpected error in product update:", error);
    logError("handleProductUpdate", error as Error, { productId, data });
    return false;
  } finally {
    setIsSubmitting(false);
  }
};
