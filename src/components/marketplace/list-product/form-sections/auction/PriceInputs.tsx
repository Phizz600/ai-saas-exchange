
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";

interface PriceInputsProps {
  form: UseFormReturn<ListProductFormData>;
  formatCurrencyInput: (value: string) => string;
  parseCurrencyValue: (value: string) => number;
}

export function PriceInputs({ form, formatCurrencyInput, parseCurrencyValue }: PriceInputsProps) {
  const isAuction = form.watch("isAuction");

  if (!isAuction) {
    return (
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 my-[16px]">
              Fixed Price (USD)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Set a fixed price for your product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter price"
                value={formatCurrencyInput(field.value?.toString() || '')}
                onChange={e => {
                  const value = parseCurrencyValue(e.target.value);
                  field.onChange(value);
                }}
                className="font-mono"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startingPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 my-[16px]">
              Starting Price (USD)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Starting price for your Dutch auction. Price drops until sold.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter starting price"
                value={formatCurrencyInput(field.value?.toString() || '')}
                onChange={e => {
                  const value = parseCurrencyValue(e.target.value);
                  field.onChange(value);
                }}
                className="font-mono"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="reservePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 my-[16px]">
              Reserve Price (USD)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>The lowest price you're willing to accept. Set to 0 for a no-reserve auction that will sell at any price.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter reserve price"
                value={formatCurrencyInput(field.value?.toString() || '')}
                onChange={e => {
                  const value = parseCurrencyValue(e.target.value);
                  field.onChange(value >= 0 ? value : 0);
                }}
                className="font-mono"
              />
            </FormControl>
            <FormMessage />
            {field.value === 0 && (
              <div className="text-xs text-amber-500 mt-1 flex items-center">
                This will be a no-reserve auction (will sell at any price)
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
