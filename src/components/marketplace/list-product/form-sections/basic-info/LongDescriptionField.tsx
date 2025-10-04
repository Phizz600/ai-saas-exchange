import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface LongDescriptionFieldProps {
  form: UseFormReturn<ListProductFormData>;
}
export function LongDescriptionField({ form }: LongDescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="longDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Long Description (Optional)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover">
                  <p>Provide a detailed description of your product, its history, and unique selling points</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Provide detailed information about your product..."
              className="min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}