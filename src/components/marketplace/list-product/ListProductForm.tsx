import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./ImageUpload";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { MetricsSection } from "./form-sections/MetricsSection";
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

        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Development Stage</FormLabel>
              <FormControl>
                <Input placeholder="e.g., MVP, Revenue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Listing Product..." : "List Product"}
        </Button>
      </form>
    </Form>
  );
}