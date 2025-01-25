import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { MetricsSection } from "./MetricsSection";
import { ImageSection } from "./form-sections/ImageSection";
import { DevelopmentStageSection } from "./form-sections/DevelopmentStageSection";
import { ListProductFormData } from "./types";

export function ListProductForm() {
  const [isLoading, setIsLoading] = useState(false);
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
    },
  });

  const onSubmit = async (data: ListProductFormData) => {
    try {
      setIsLoading(true);
      console.log('Submitting product data:', data);

      let image_url = null;
      if (data.image) {
        const fileExt = data.image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, data.image);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        image_url = publicUrl;
      }

      const { error } = await supabase.from('products').insert({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        stage: data.stage,
        monthly_revenue: data.monthlyRevenue,
        monthly_traffic: data.monthlyTraffic,
        image_url,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your product has been listed successfully.",
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
        <BasicInfoSection form={form} />
        <FinancialSection form={form} />
        <MetricsSection form={form} />
        <DevelopmentStageSection form={form} />
        <ImageSection form={form} />

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