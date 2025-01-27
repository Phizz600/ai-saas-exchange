import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DevelopmentStageSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function DevelopmentStageSection({ form }: DevelopmentStageSectionProps) {
  const developmentStages = [
    "MVP",
    "Beta",
    "Production Ready",
    "Revenue Generating",
    "Scaling",
    "Other"
  ];

  return (
    <FormField
      control={form.control}
      name="stage"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Development Stage
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Indicate the current development phase of your AI product</p>
                  <ul className="list-disc ml-4 mt-1 text-sm">
                    <li>MVP: Minimum viable product</li>
                    <li>Beta: Testing phase with early users</li>
                    <li>Production Ready: Stable and ready for general use</li>
                    <li>Revenue Generating: Actively earning income</li>
                    <li>Scaling: Growing user base and features</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
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
  );
}