
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductInfoFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ProductInfoFields({ form }: ProductInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium exo-2-heading">Product Information</h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name <span className="text-red-500">*</span></FormLabel>
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
          <FormItem>
            <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your product in detail" 
                className="resize-none min-h-[100px]" 
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
          <FormItem>
            <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="natural_language_processing">Natural Language Processing</SelectItem>
                <SelectItem value="machine_learning">Machine Learning</SelectItem>
                <SelectItem value="content_generation">Content Generation</SelectItem>
                <SelectItem value="computer_vision">Computer Vision</SelectItem>
                <SelectItem value="voice_speech">Voice & Speech</SelectItem>
                <SelectItem value="data_analytics">Data Analytics</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="recommendation_systems">Recommendation Systems</SelectItem>
                <SelectItem value="ai_application">AI Applications</SelectItem>
                <SelectItem value="ai_tool">AI Tools</SelectItem>
                <SelectItem value="llm">LLM</SelectItem>
                <SelectItem value="chatbot">Chatbots</SelectItem>
                <SelectItem value="training_data">Training Data</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
