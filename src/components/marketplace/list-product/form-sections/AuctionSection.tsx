
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { useAuctionCalculations } from "../hooks/useAuctionCalculations";
import { PriceInputs } from "./auction/PriceInputs";
import { AuctionSettings } from "./auction/AuctionSettings";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface AuctionSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function AuctionSection({ form }: AuctionSectionProps) {
  const { recommendedDecrement } = useAuctionCalculations(form);

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(numericValue);
    return !isNaN(parsed) 
      ? `$${parsed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` 
      : '';
  };

  const parseCurrencyValue = (value: string) => {
    const parsed = parseFloat(value.replace(/[^0-9.]/g, ''));
    return !isNaN(parsed) && parsed > 0 ? parsed : 0;
  };

  const setAuctionEndDate = (duration: string) => {
    const endDate = new Date();
    switch (duration) {
      case "14days": endDate.setDate(endDate.getDate() + 14); break;
      case "30days": endDate.setDate(endDate.getDate() + 30); break;
      case "60days": endDate.setDate(endDate.getDate() + 60); break;
      case "90days": endDate.setDate(endDate.getDate() + 90); break;
      default: endDate.setDate(endDate.getDate() + 30);
    }
    form.setValue("auctionEndTime", endDate);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Selling Method
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="bg-white">
              <p>Choose how you want to sell your product: fixed price or Dutch auction</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="isAuction"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Use Dutch Auction
                </FormLabel>
                <FormDescription>
                  Select if you want to use a Dutch auction where the price gradually decreases
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <PriceInputs 
          form={form} 
          formatCurrencyInput={formatCurrencyInput} 
          parseCurrencyValue={parseCurrencyValue} 
        />

        {form.watch("isAuction") && (
          <AuctionSettings 
            form={form} 
            recommendedDecrement={recommendedDecrement}
            formatCurrencyInput={formatCurrencyInput}
            parseCurrencyValue={parseCurrencyValue}
            setAuctionEndDate={setAuctionEndDate}
          />
        )}
      </div>
    </div>
  );
}
