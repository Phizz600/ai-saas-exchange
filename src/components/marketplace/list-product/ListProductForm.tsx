import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { FinancialSection } from "./form-sections/FinancialSection";
import { MetricsSection } from "./MetricsSection";
import { ListProductFormData } from "./types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const developmentStages = [
    "MVP",
    "Beta",
    "Production Ready",
    "Revenue Generating",
    "Scaling",
    "Other"
  ];

  const categories = [
    "Content Generation",
    "Image Generation",
    "Customer Service",
    "Development Tools",
    "Data Analysis",
    "Marketing",
    "Other"
  ];

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select development stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {developmentStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Product Image
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-white">
                      <p>Recommended image specifications:</p>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Maximum size: 5MB</li>
                        <li>Optimal dimensions: 1200x630 pixels</li>
                        <li>Accepted formats: JPG, PNG, WebP</li>
                        <li>You can use a screenshot of your product's homepage or landing page</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
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

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transform transition-all duration-200 
          shadow-[0_4px_0_rgb(42,98,143)] hover:shadow-[0_2px_0px_rgb(42,98,143)] 
          hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_0px_0px_rgb(42,98,143)]"
          disabled={isLoading}
        >
          {isLoading ? "Listing Product..." : "List Product"}
        </Button>
      </form>
    </Form>
  );
}