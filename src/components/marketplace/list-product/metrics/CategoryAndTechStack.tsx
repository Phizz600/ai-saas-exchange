
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info } from "lucide-react";
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

interface CategoryAndTechStackProps {
  form: UseFormReturn<ListProductFormData>;
}

export function CategoryAndTechStack({ form }: CategoryAndTechStackProps) {
  const categories = [
    "Content Generation",
    "Image Generation",
    "Data Analysis",
    "Chatbots",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Other"
  ];

  const techStacks = [
    "TensorFlow",
    "PyTorch",
    "OpenAI",
    "Hugging Face",
    "Custom ML",
    "Other"
  ];

  const watchCategory = form.watch("category");
  const watchTechStack = form.watch("techStack");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Category
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Select the category that best describes your AI product's primary function</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a category" />
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

        {watchCategory === "Other" && (
          <FormField
            control={form.control}
            name="categoryOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Tech Stack
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Primary technology used in your AI product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select tech stack" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {techStacks.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchTechStack === "Other" && (
          <FormField
            control={form.control}
            name="techStackOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Tech Stack</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your tech stack" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
