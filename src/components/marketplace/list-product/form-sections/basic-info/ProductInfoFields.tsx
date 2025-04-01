
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListProductFormData } from "../../types";
import { NdaSection } from "./NdaSection";

interface ProductInfoFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ProductInfoFields({ form }: ProductInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Product Details</h2>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter a descriptive title" {...field} />
            </FormControl>
            <FormDescription>
              A clear, concise name for your product (50 characters max).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your product in detail" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description of your product, including its core features and benefits.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="demo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Demo URL</FormLabel>
            <FormControl>
              <Input placeholder="https://demo.yourproduct.com" {...field} />
            </FormControl>
            <FormDescription>
              Link to a live demo of your product (optional).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <NdaSection />
    </div>
  );
}
