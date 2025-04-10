
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../list-product/types";

interface FinancialSectionProps {
  form: UseFormReturn<Partial<ListProductFormData>>;
}

export const FinancialSection = ({ form }: FinancialSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="monthlyRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MRR or AMR (Monthly Revenue)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="monthlyProfit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Profit</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
