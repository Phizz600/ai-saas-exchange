import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReasonForSellingFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ReasonForSellingField({ form }: ReasonForSellingFieldProps) {
  return (
    <FormField
      control={form.control}
      name="reasonForSelling"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Reason for Selling
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Share why you're selling this product - transparency builds trust</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="e.g., Moving to a new project, focusing on other ventures, retirement..."
              className="resize-none min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
