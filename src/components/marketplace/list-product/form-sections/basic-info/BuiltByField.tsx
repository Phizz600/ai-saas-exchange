import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BuiltByFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function BuiltByField({ form }: BuiltByFieldProps) {
  const builtByOptions = [
    { value: "solo_founder", label: "Solo Founder" },
    { value: "team", label: "Team" },
    { value: "agency", label: "Agency" },
    { value: "outsourced", label: "Outsourced" },
  ];

  return (
    <FormField
      control={form.control}
      name="builtBy"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Built By
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Who built this product?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select who built this" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {builtByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
