
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info, Link } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductInfoFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ProductInfoFields({ form }: ProductInfoFieldsProps) {
  const categories = [
    "Natural Language Processing",
    "Machine Learning",
    "Content Generation",
    "Computer Vision",
    "Voice & Speech",
    "Data Analytics",
    "Automation",
    "Recommendation Systems",
    "Image Generation",
    "Generative AI",
    "Chatbots",
    "AI Agents",
    "Decision Support",
    "Edge AI",
    "AI Infrastructure",
    "AI Research Tools",
    "Language Translation",
    "AI Security",
    "Robotics",
    "AI Testing & QA",
    "AI Healthcare",
    "AI Education",
    "AI Finance",
    "Other"
  ];

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Product Title
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Choose a clear, descriptive title that highlights your AI product's main feature or purpose</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter your product title" {...field} />
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
            <FormLabel className="flex items-center gap-2">
              AI Category
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Select the primary category that best describes your AI tool's functionality</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select AI category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="bg-white hover:bg-gray-100">
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Description
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Provide detailed information about your AI product's features, capabilities, and use cases</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your AI product..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="demoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Link to Product
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Provide a link to your product's website or demo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="https://your-product.com" 
                  {...field}
                  className="pl-9"
                />
                <Link className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Business Type
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Select whether your product primarily serves businesses (B2B) or consumers (B2C)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                <SelectItem value="B2B" className="bg-white hover:bg-gray-100">
                  B2B (Business to Business)
                </SelectItem>
                <SelectItem value="B2C" className="bg-white hover:bg-gray-100">
                  B2C (Business to Consumer)
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
