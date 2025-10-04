
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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

interface StageFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function StageField({ form }: StageFieldProps) {
  const stages = [
    "MVP",
    "Beta",
    "Production Ready",
    "Revenue Generating",
    "Scaling"
  ];

  return (
    <FormField
      control={form.control}
      name="stage"
      rules={{ required: "Development stage is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Development Stage <span className="text-red-500">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Current development phase of your product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {stages.map((stage) => (
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
