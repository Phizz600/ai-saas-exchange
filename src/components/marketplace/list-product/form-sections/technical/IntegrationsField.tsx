
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

interface IntegrationsFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function IntegrationsField({ form }: IntegrationsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="integrations_other"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Integrations
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>List key integrations (e.g., "Slack, Salesforce, Stripe")</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input placeholder="e.g., Slack, Salesforce, Stripe" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
