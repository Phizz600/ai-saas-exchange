import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";

interface FinancialSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function FinancialSection({ form }: FinancialSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asking Price (USD)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter asking price"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="monthlyRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Revenue (USD)</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Enter monthly revenue"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}