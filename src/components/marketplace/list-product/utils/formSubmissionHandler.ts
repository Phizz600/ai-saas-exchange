
import { ListProductFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/integrations/supabase/products";
import { sendListingNotification } from "@/integrations/supabase/functions";

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

    // Prepare the product data
    const productData = {
      title: data.title,
      description: data.description,
      price: data.isAuction ? null : data.price, // Only set price for fixed-price listings
      category: data.category,
      stage: data.stage,
      industry: data.industry,
      monthly_revenue: data.monthlyRevenue,
      monthly_traffic: data.monthlyTraffic,
      active_users: data.activeUsers,
      gross_profit_margin: data.grossProfitMargin, // Using the correct column name 'gross_profit_margin'
      tech_stack: data.techStack,
      tech_stack_other: data.techStackOther,
      team_size: data.teamSize,
      has_patents: data.hasPatents,
      competitors: data.competitors,
      demo_url: data.demoUrl,
      is_verified: data.isVerified,
      special_notes: data.specialNotes,
      listing_type: data.isAuction ? 'dutch_auction' : 'fixed_price',
      // Auction fields
      auction_end_time: data.isAuction 
        ? calculateAuctionEndTime(data.auctionDuration)
        : null,
      starting_price: data.isAuction ? data.startingPrice : null,
      reserve_price: data.isAuction ? data.reservePrice : null, // Explicitly use reserve_price for auctions
      price_decrement: data.isAuction ? data.priceDecrement : null,
      price_decrement_interval: data.isAuction ? data.priceDecrementInterval : null,
      no_reserve: data.isAuction ? data.noReserve : null,
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
    if (data.image) {
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
        
        await sendListingNotification(
          'submitted',
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

// Helper function to calculate auction end time based on duration
function calculateAuctionEndTime(duration: string): string {
  const now = new Date();
  
  switch (duration) {
    case '24hours':
      now.setHours(now.getHours() + 24);
      break;
    case '3days':
      now.setDate(now.getDate() + 3);
      break;
    case '7days':
      now.setDate(now.getDate() + 7);
      break;
    case '14days':
      now.setDate(now.getDate() + 14);
      break;
    case '30days':
    default:
      now.setDate(now.getDate() + 30);
      break;
  }
  
  return now.toISOString();
}

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

    // Prepare the product data for update
    const productData: Record<string, any> = {};
    
    // Map form fields to database fields
    if (data.title) productData.title = data.title;
    if (data.description) productData.description = data.description;
    if (data.price !== undefined) productData.price = data.price;
    if (data.category) productData.category = data.category;
    if (data.stage) productData.stage = data.stage;
    if (data.industry) productData.industry = data.industry;
    if (data.monthlyRevenue !== undefined) productData.monthly_revenue = data.monthlyRevenue;
    if (data.monthlyTraffic) productData.monthly_traffic = data.monthlyTraffic;
    if (data.activeUsers) productData.active_users = data.activeUsers;
    if (data.grossProfitMargin !== undefined) productData.gross_profit_margin = data.grossProfitMargin;
    if (data.techStack) productData.tech_stack = data.techStack;
    if (data.techStackOther) productData.tech_stack_other = data.techStackOther;
    if (data.teamSize) productData.team_size = data.teamSize;
    if (data.hasPatents !== undefined) productData.has_patents = data.hasPatents;
    if (data.competitors) productData.competitors = data.competitors;
    if (data.demoUrl) productData.demo_url = data.demoUrl;
    if (data.specialNotes) productData.special_notes = data.specialNotes;
    if (data.productLink) productData.product_link = data.productLink;
    
    // Handle auction parameters using reserve_price instead of min_price
    if (data.isAuction) {
      if (data.reservePrice !== undefined) productData.reserve_price = data.reservePrice;
      if (data.startingPrice !== undefined) productData.starting_price = data.startingPrice;
      if (data.priceDecrement !== undefined) productData.price_decrement = data.priceDecrement;
      if (data.priceDecrementInterval) productData.price_decrement_interval = data.priceDecrementInterval;
      if (data.noReserve !== undefined) productData.no_reserve = data.noReserve;
    }
    
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
