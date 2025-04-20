
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";

interface AuctionSettingsProps {
  form: UseFormReturn<ListProductFormData>;
  recommendedDecrement: number;
  formatCurrencyInput: (value: string) => string;
  parseCurrencyValue: (value: string) => number;
  setAuctionEndDate: (duration: string) => void;
}

export function AuctionSettings({ 
  form, 
  recommendedDecrement, 
  formatCurrencyInput, 
  parseCurrencyValue,
  setAuctionEndDate 
}: AuctionSettingsProps) {
  const getDecrementIntervalLabel = (interval: string) => {
    switch (interval) {
      case "day": return "Per Day";
      case "week": return "Per Week";
      case "month": return "Per Month";
      default: return "Select interval";
    }
  };

  const getAuctionDurationLabel = (duration: string) => {
    switch (duration) {
      case "14days": return "14 Days";
      case "30days": return "30 Days";
      case "60days": return "60 Days";
      case "90days": return "90 Days";
      default: return "Select duration";
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="auctionDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Auction Duration
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>How long your auction will run before it ends</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select 
              onValueChange={value => {
                field.onChange(value);
                setAuctionEndDate(value);
              }} 
              defaultValue={field.value || "30days"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration">
                    {field.value ? getAuctionDurationLabel(field.value) : "30 Days"}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="14days">14 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="60days">60 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="priceDecrement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Price Decrement (USD)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>How much the price will decrease per selected time interval until reaching the reserve price</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter price decrement"
                  value={formatCurrencyInput(field.value?.toString() || '')}
                  onChange={e => {
                    const value = parseCurrencyValue(e.target.value);
                    field.onChange(value);
                  }}
                  className="font-mono"
                />
              </FormControl>
              {recommendedDecrement > 0 && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => form.setValue("priceDecrement", recommendedDecrement)}
                    className="text-primary hover:underline flex items-center"
                  >
                    Recommended: ${recommendedDecrement}/interval
                  </button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceDecrementInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Decrement Interval
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>How often the price should decrease. Changes here will affect the recommended price decrement.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "day"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval">
                      {field.value ? getDecrementIntervalLabel(field.value) : "Select interval"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="week">Per Week</SelectItem>
                  <SelectItem value="month">Per Month</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
