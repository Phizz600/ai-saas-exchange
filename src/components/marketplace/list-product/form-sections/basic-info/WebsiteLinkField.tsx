import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface WebsiteLinkFieldProps {
  form: UseFormReturn<ListProductFormData>;
}
export function WebsiteLinkField({
  form
}: WebsiteLinkFieldProps) {
  return (
    <FormField
      control={form.control}
      name="productLink"
      rules={{ required: "Website link is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Website Link <span className="text-red-500">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover">
                  <p>Your product's main website URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input
              placeholder="https://your-product.com"
              type="url"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}