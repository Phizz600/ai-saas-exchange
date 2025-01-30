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

export function ListProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ListProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      stage: "",
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormProgressBar currentSection={currentSection} />
        
        <section id="basics" className="space-y-8">
          <BasicInfoSection form={form} />
        </section>

        <section id="financials" className="space-y-8">
          <FinancialSection form={form} />
        </section>

        <section id="technical" className="space-y-8">
          <TechnicalSection form={form} />
        </section>

        <section id="traffic" className="space-y-8">
          <TrafficSection form={form} />
        </section>

        <section id="auction" className="space-y-8">
          <AuctionSection form={form} />
        </section>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transform transition-all duration-200 
          shadow-[0_4px_0_rgb(42,98,143)] hover:shadow-[0_2px_0px_rgb(42,98,143)] 
          hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_0px_0px_rgb(42,98,143)]"
          disabled={isLoading}
        >
          {isLoading ? "Submitting Product..." : "Submit Product"}
        </Button>
      </form>
    </Form>
  );
}