import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KeyFeaturesFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function KeyFeaturesField({ form }: KeyFeaturesFieldProps) {
  return (
    <FormField
      control={form.control}
      name="keyFeatures"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            List Key Features*
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover">
                  <p>List the main features of your product (one per line or comma-separated)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="E.g., AI-powered analytics, Real-time collaboration, API integrations..."
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
