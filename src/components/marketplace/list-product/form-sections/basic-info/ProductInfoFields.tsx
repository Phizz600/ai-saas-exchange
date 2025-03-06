
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface ProductInfoFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

// Define all allowed categories (matching our database constraint)
const ALLOWED_CATEGORIES = [
  'Natural Language Processing',
  'Machine Learning',
  'Content Generation',
  'Computer Vision',
  'Voice & Speech',
  'Data Analytics',
  'Automation',
  'Recommendation Systems',
  'AI Applications',
  'AI Tools',
  'LLM',
  'Chatbots',
  'Training Data',
  'Other'
];

export function ProductInfoFields({
  form
}: ProductInfoFieldsProps) {
  const categoryValue = form.watch("category");
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 75;

  // Set categoryOther field value to null when category is not "other"
  useEffect(() => {
    if (categoryValue !== "Other") {
      form.setValue("categoryOther", "");
    }
  }, [categoryValue, form]);
  
  return (
    <div className="space-y-4 text-left">
      
      <FormField 
        control={form.control} 
        name="title" 
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel className="text-left">Product Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter your product name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="description" 
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel className="text-left">Description <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your product in detail" 
                className="resize-none min-h-[100px]" 
                maxLength={MAX_CHARS}
                onChange={(e) => {
                  setCharCount(e.target.value.length);
                  field.onChange(e);
                }}
                value={field.value}
              />
            </FormControl>
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${charCount > MAX_CHARS - 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="productLink" 
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel className="text-left">Product Link</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://your-product-website.com" 
                type="url" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="category" 
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel className="text-left">Category <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ALLOWED_CATEGORIES.map((category) => (
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
      
      {/* Show "Other Category" input field when "Other" is selected */}
      {categoryValue === "Other" && (
        <FormField 
          control={form.control} 
          name="categoryOther" 
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Other Category <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Please specify your category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      )}
    </div>
  );
}
