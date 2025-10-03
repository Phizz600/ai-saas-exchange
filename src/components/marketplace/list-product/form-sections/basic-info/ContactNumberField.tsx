import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContactNumberFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ContactNumberField({ form }: ContactNumberFieldProps) {
  return (
    <FormField
      control={form.control}
      name="contactNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Contact Number
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Phone number for serious buyers to reach you</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input placeholder="+1 (555) 123-4567" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
