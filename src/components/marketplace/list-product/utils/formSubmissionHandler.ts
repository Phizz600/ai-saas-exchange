
import { ListProductFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/integrations/supabase/products";

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
      profit_margin: data.grossProfitMargin,
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
      reserve_price: data.isAuction ? data.reservePrice : null,
      price_decrement: data.isAuction ? data.priceDecrement : null,
      price_decrement_interval: data.isAuction ? data.priceDecrementInterval : null,
      no_reserve: data.isAuction ? data.noReserve : null,
      // Status and user fields
      status: "pending",
      user_id: user.id,
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
