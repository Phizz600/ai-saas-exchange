import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RevenueTrendFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function RevenueTrendField({ form }: RevenueTrendFieldProps) {
  return (
    <FormField
      control={form.control}
      name="revenueTrend"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Last 3 Months Revenue Trend
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover">
                  <p>How has your revenue changed over the last 3 months?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select trend" />
              </SelectTrigger>
            </FormControl>
            <SelectContent position="item-aligned" className="bg-popover">
              <SelectItem value="growing">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Growing</span>
                </div>
              </SelectItem>
              <SelectItem value="stable">
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-blue-600" />
                  <span>Stable</span>
                </div>
              </SelectItem>
              <SelectItem value="declining">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span>Declining</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
