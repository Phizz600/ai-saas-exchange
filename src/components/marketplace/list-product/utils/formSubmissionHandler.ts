
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
    if (data.image) {
      const fileExt = data.image.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, data.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      image_url = publicUrl;
    }

    const monthlyTrafficValue = data.monthlyTraffic ? getTrafficValue(data.monthlyTraffic) : 0;

    const productData = {
      title: data.title,
      description: data.description,
      price: data.isAuction ? data.startingPrice : data.price || 0,
      category: data.category,
      stage: data.stage,
      industry: data.industry,
      monthly_revenue: data.monthlyRevenue || 0,
      gross_profit_margin: data.grossProfitMargin || 0,
      monthly_traffic: monthlyTrafficValue,
      image_url,
      seller_id: user.id,
      tech_stack: data.techStack === 'Other' ? data.techStackOther : data.techStack,
      team_size: data.teamSize,
      has_patents: data.hasPatents,
      competitors: data.competitors,
      demo_url: data.demoUrl,
      is_revenue_verified: data.isRevenueVerified || false,
      is_code_audited: data.isCodeAudited || false,
      is_traffic_verified: data.isTrafficVerified || false,
      product_age: data.productAge,
      business_location: data.businessLocation,
      special_notes: data.specialNotes,
      ...(data.isAuction && {
        auction_end_time: data.auctionEndTime?.toISOString(),
        starting_price: data.startingPrice || 0,
        current_price: data.startingPrice || 0,
        min_price: data.minPrice || 0,
        price_decrement: data.priceDecrement || 0,
        price_decrement_interval: data.priceDecrementInterval
      })
    };

    const { error } = await supabase.from('products').insert(productData);

    if (error) throw error;

    toast({
      title: "Product Submitted Successfully!",
      description: "Thank you for your submission. After a quick team review, your product will be made live for purchase on the marketplace.",
      duration: 5000,
    });

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
