import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReviewLinkFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ReviewLinkField({ form }: ReviewLinkFieldProps) {
  return (
    <FormField
      control={form.control}
      name="reviewLink"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Review / Loom Link
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Add a video walkthrough (Loom) or link to product reviews</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input
              type="url"
              placeholder="https://loom.com/..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
