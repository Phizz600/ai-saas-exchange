
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Sparkle } from "lucide-react";
import { calculateValuation, formatCurrency } from "../utils/valuationCalculator";
import { useEffect, useState } from "react";
import { useAuctionCalculations } from "../hooks/useAuctionCalculations";
import { PriceInputs } from "./auction/PriceInputs";
import { AuctionSettings } from "./auction/AuctionSettings";

interface AuctionSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function AuctionSection({ form }: AuctionSectionProps) {
  const {
    valuation,
    setValuation,
    recommendedDecrement,
    isAuction,
    startingPrice
  } = useAuctionCalculations(form);
  
  const watchMonthlyRevenue = form.watch("monthlyRevenue") || 0;
  const watchMonthlyChurnRate = form.watch("monthlyChurnRate") || 0;
  const watchGrossProfitMargin = (form.watch("grossProfitMargin") || 0) / 100;
  const watchIndustry = form.watch("industry") || "";
  const watchHasPatents = form.watch("hasPatents") || false;
  const watchCustomerAcquisitionCost = form.watch("customerAcquisitionCost");
  
  const formatCurrencyInput = (value: string) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    if (numericValue) {
      const number = parseFloat(numericValue);
      if (!isNaN(number)) {
        return `$${number.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })}`;
      }
    }
    return '';
  };
  
  const parseCurrencyValue = (value: string) => {
    const numericValue = parseFloat(value.replace(/[$,]/g, ''));
    return isNaN(numericValue) || numericValue <= 0 ? 1 : numericValue;
  };

  const setAuctionEndDate = (duration: string) => {
    const today = new Date();
    let endDate: Date;
    switch (duration) {
      case "14days": endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); break;
      case "30days": endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); break;
      case "60days": endDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); break;
      case "90days": endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000); break;
      default: endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    form.setValue("auctionEndTime", endDate);
  };
  
  const handleValuationClick = (e: React.MouseEvent, value: number, isHigh: boolean) => {
    e.preventDefault();
    if (isAuction) {
      if (isHigh) {
        form.setValue("startingPrice", Math.max(1, value));
      } else {
        form.setValue("reservePrice", Math.max(1, value));
      }
    } else {
      form.setValue("price", Math.max(1, value));
    }
  };

  useEffect(() => {
    const updateValuation = async () => {
      const newValuation = await calculateValuation(
        watchMonthlyRevenue,
        watchMonthlyChurnRate / 100,
        watchGrossProfitMargin,
        watchIndustry,
        watchHasPatents,
        undefined,
        undefined,
        watchCustomerAcquisitionCost
      );
      setValuation(newValuation);
    };
    updateValuation();
  }, [watchMonthlyRevenue, watchMonthlyChurnRate, watchGrossProfitMargin, watchIndustry, watchHasPatents, watchCustomerAcquisitionCost]);

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${!isAuction ? "text-primary" : "text-gray-500"}`}>
            Fixed Price
          </span>
          <FormField
            control={form.control}
            name="isAuction"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <span className={`text-sm ${isAuction ? "text-primary" : "text-gray-500"}`}>
            Dutch Auction
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <PriceInputs
          form={form}
          formatCurrencyInput={formatCurrencyInput}
          parseCurrencyValue={parseCurrencyValue}
        />

        {isAuction && (
          <AuctionSettings
            form={form}
            recommendedDecrement={recommendedDecrement}
            formatCurrencyInput={formatCurrencyInput}
            parseCurrencyValue={parseCurrencyValue}
            setAuctionEndDate={setAuctionEndDate}
          />
        )}

        {/* Hidden fields */}
        <FormField
          control={form.control}
          name="auctionEndTime"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="noReserve"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <Card className="p-6 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white mt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
          <Sparkle className="h-5 w-5" />
          AI-Powered Valuation Range
        </h3>
        <div className="text-2xl font-bold flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={e => handleValuationClick(e, valuation.low, false)}
            className="hover:opacity-80 transition-opacity"
          >
            {formatCurrency(valuation.low)}
          </button>
          <span>-</span>
          <button
            type="button"
            onClick={e => handleValuationClick(e, valuation.high, true)}
            className="hover:opacity-80 transition-opacity"
          >
            {formatCurrency(valuation.high)}
          </button>
        </div>
        <p className="text-sm mt-2 text-white/80">
          This AI-powered valuation is based on your monthly revenue, churn rate,
          profit margins, customer acquisition costs, and other factors. Our machine
          learning model analyzes these metrics to provide a customized valuation
          range. Click on either value to use it as your {isAuction ? "auction prices" : "fixed price"}.
        </p>
      </Card>
    </Card>
  );
}
