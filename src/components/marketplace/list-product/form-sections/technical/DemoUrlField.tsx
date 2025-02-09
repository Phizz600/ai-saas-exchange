
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DemoUrlFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function DemoUrlField({ form }: DemoUrlFieldProps) {
  return (
    <FormField
      control={form.control}
      name="demoUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Demo URL
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Link to a live demo or product walkthrough</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input placeholder="https://" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
