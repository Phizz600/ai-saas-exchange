import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";

interface PriceInputsProps {
  form: UseFormReturn<ListProductFormData>;
  formatCurrencyInput: (value: string) => string;
  parseCurrencyValue: (value: string) => number;
}

export function PriceInputs({ form, formatCurrencyInput, parseCurrencyValue }: PriceInputsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Asking Price
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set your fixed selling price for the business</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ? formatCurrencyInput(field.value.toString()) : ""}
                onChange={(e) => {
                  const value = parseCurrencyValue(e.target.value);
                  field.onChange(value);
                }}
                placeholder="$100,000"
                className="text-lg font-semibold"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}