
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TechStackFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TechStackField({ form }: TechStackFieldProps) {
  const techStacks = [
    "TensorFlow",
    "PyTorch",
    "OpenAI",
    "Hugging Face",
    "Custom ML",
    "Other"
  ];

  const watchTechStack = form.watch("techStack");

  return (
    <>
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
    </>
  );
}
