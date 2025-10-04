import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { PriceInputs } from "./auction/PriceInputs";
import { calculateValuation, formatCurrency } from "../utils/valuationCalculator";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
interface PricingSectionProps {
  form: UseFormReturn<ListProductFormData>;
}
export function PricingSection({
  form
}: PricingSectionProps) {
  const [valuation, setValuation] = useState({
    low: 0,
    high: 0
  });
  const monthlyRevenue = form.watch("monthlyRevenue");
  const monthlyChurnRate = form.watch("monthlyChurnRate");
  const grossProfitMargin = form.watch("grossProfitMargin");
  const industry = form.watch("industry");
  const hasPatents = form.watch("hasPatents");
  const customerAcquisitionCost = form.watch("customerAcquisitionCost");
  const formatCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/[^\d.]/g, "");
    return numericValue ? `$${Number(numericValue).toLocaleString()}` : "";
  };
  const parseCurrencyValue = (value: string): number => {
    const numericValue = parseFloat(value.replace(/[$,]/g, ''));
    return isNaN(numericValue) || numericValue <= 0 ? 1 : numericValue;
  };
  const updateValuation = async () => {
    if (!monthlyRevenue) return;
    try {
      const result = await calculateValuation(monthlyRevenue, monthlyChurnRate || 0, grossProfitMargin || 0, industry, hasPatents, monthlyRevenue, undefined, customerAcquisitionCost);
      setValuation(result);
    } catch (error) {
      console.error("Error calculating valuation:", error);
    }
  };
  useEffect(() => {
    updateValuation();
  }, [monthlyRevenue, monthlyChurnRate, grossProfitMargin, industry, hasPatents, customerAcquisitionCost]);
  const handleValuationClick = (value: number) => {
    form.setValue("price", value);
  };
  return <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Price Input Section */}
          <PriceInputs form={form} formatCurrencyInput={formatCurrencyInput} parseCurrencyValue={parseCurrencyValue} />

          {/* AI Valuation Section */}
          {valuation.low > 0 && valuation.high > 0 && <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🤖 AI-Powered Valuation</h4>
              <p className="text-sm text-green-700 mb-3">
                Based on your metrics, we estimate your business value between:
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => handleValuationClick(valuation.low)} className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm font-medium transition-colors">
                  {formatCurrency(valuation.low)} (Conservative)
                </button>
                <button type="button" onClick={() => handleValuationClick(valuation.high)} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm font-medium transition-colors">
                  {formatCurrency(valuation.high)} (Optimistic)
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Click to set as your asking price
              </p>
            </div>}
          
          {/* TOS Agreement */}
          <FormField 
            control={form.control} 
            name="tosAgreed" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the Terms & Conditions
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    By checking this box, you confirm that all information provided is accurate.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>;
}