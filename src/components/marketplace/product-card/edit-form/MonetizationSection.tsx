
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../list-product/types";
import { useState, useEffect } from "react";

interface MonetizationSectionProps {
  form: UseFormReturn<Partial<ListProductFormData>>;
}

export const MonetizationSection = ({ form }: MonetizationSectionProps) => {
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
    const parsed = parseFloat(value.replace(/[$,]/g, ''));
    // Ensure parsed value is positive or at minimum 1
    return !isNaN(parsed) && parsed > 0 ? parsed : 1;
  };

  // Track auction state to conditionally render price field
  const isAuction = form.watch("isAuction");
  
  // If switching to auction, ensure price is cleared
  useEffect(() => {
    if (isAuction) {
      // When editing and switching to auction mode, clear the price field
      form.setValue("price", undefined);
    }
  }, [isAuction, form]);

  return (
    <>
      {/* Only show price field for fixed price listings */}
      {!isAuction && (
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asking Price</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={formatCurrencyInput(field.value?.toString() || '')}
                  onChange={(e) => field.onChange(parseCurrencyValue(e.target.value))}
                  className="font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="monthlyRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Revenue</FormLabel>
            <FormControl>
              <Input
                type="text"
                value={formatCurrencyInput(field.value?.toString() || '')}
                onChange={(e) => field.onChange(parseCurrencyValue(e.target.value))}
                className="font-mono"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerAcquisitionCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Acquisition Cost</FormLabel>
            <FormControl>
              <Input
                type="text"
                value={formatCurrencyInput(field.value?.toString() || '')}
                onChange={(e) => field.onChange(parseCurrencyValue(e.target.value))}
                className="font-mono"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
