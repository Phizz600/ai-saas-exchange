import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { TechnicalSection } from "./form-sections/TechnicalSection";
import { TrafficSection } from "./form-sections/TrafficSection";
import { AuctionSection } from "./form-sections/AuctionSection";
import { FormProgressBar } from "./form-sections/FormProgressBar";
import { ListProductFormData } from "./types";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ListProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sections = [
    { id: 0, title: "Basics", component: BasicInfoSection },
    { id: 1, title: "Financials", component: FinancialSection },
    { id: 2, title: "Technical", component: TechnicalSection },
    { id: 3, title: "Traffic", component: TrafficSection },
    { id: 4, title: "Dutch Auction", component: AuctionSection },
  ];

  const form = useForm<ListProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      stage: "",
      industry: "",
      monthlyRevenue: 0,
      monthlyTraffic: 0,
      image: null,
      isAuction: false,
      startingPrice: 0,
      minPrice: 0,
      priceDecrement: 0,
      priceDecrementInterval: "minute",
      techStack: "",
      techStackOther: "",
      integrations: "",
      integrationsOther: "",
      teamSize: "",
      hasPatents: false,
      competitors: "",
      demoUrl: "",
      isVerified: false,
    },
  });

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: ListProductFormData) => {
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
        return;
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

      const productData = {
        title: data.title,
        description: data.description,
        price: data.isAuction ? data.startingPrice : data.price,
        category: data.category,
        stage: data.stage,
        industry: data.industry,
        monthly_revenue: data.monthlyRevenue,
        monthly_traffic: data.monthlyTraffic,
        image_url,
        seller_id: user.id,
        tech_stack: data.techStack,
        tech_stack_other: data.techStackOther,
        integrations: data.integrations,
        integrations_other: data.integrationsOther,
        team_size: data.teamSize,
        has_patents: data.hasPatents,
        competitors: data.competitors,
        demo_url: data.demoUrl,
        is_verified: data.isVerified,
        ...(data.isAuction && {
          auction_end_time: data.auctionEndTime?.toISOString(),
          starting_price: data.startingPrice,
          current_price: data.startingPrice,
          min_price: data.minPrice,
          price_decrement: data.priceDecrement,
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

      navigate("/marketplace");
    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: "Error",
        description: "Failed to list your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormProgressBar currentSection={currentSection} />
        
        <div className="space-y-8 min-h-[400px]">
          <CurrentSectionComponent form={form} />
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          {currentSection > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={previousSection}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          
          {currentSection < sections.length - 1 ? (
            <Button
              type="button"
              onClick={nextSection}
              className="ml-auto flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="ml-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transform transition-all duration-200 
              shadow-[0_4px_0_rgb(42,98,143)] hover:shadow-[0_2px_0px_rgb(42,98,143)] 
              hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_0px_0px_rgb(42,98,143)]"
              disabled={isLoading}
            >
              {isLoading ? "Submitting Product..." : "Submit Product"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}