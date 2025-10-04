import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DemoLinkFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function DemoLinkField({ form }: DemoLinkFieldProps) {
  return (
    <FormField
      control={form.control}
      name="demoUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Demo Link
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover">
                  <p>Link to a demo video or live demo of your product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input
              type="url"
              placeholder="https://youtube.com/your-demo or https://demo.yourproduct.com"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
