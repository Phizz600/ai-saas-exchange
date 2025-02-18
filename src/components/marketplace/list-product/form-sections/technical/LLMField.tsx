
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

interface LLMFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function LLMField({ form }: LLMFieldProps) {
  const llmTypes = [
    "GPT-4",
    "GPT-3.5",
    "Claude 2",
    "Claude 3",
    "Llama 2",
    "Mistral",
    "Palm 2",
    "Gemini",
    "Custom LLM",
    "Other"
  ];

  const watchLLMType = form.watch("llmType");

  return (
    <>
      <FormField
        control={form.control}
        name="llmType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              LLM Model
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Primary Language Model used in your AI product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select LLM model" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {llmTypes.map((llm) => (
                  <SelectItem key={llm} value={llm}>
                    {llm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchLLMType === "Other" && (
        <FormField
          control={form.control}
          name="llmTypeOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specify LLM Model</FormLabel>
              <FormControl>
                <Input placeholder="Enter your LLM model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
