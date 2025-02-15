
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../list-product/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonetizationSectionProps {
  form: UseFormReturn<Partial<ListProductFormData>>;
}

const MONETIZATION_OPTIONS = [
  'subscription',
  'pay_per_use',
  'freemium',
  'one_time_purchase',
  'usage_based',
  'tiered_pricing',
  'enterprise_licensing',
  'marketplace_commission',
  'advertising',
  'data_monetization',
  'affiliate',
  'other'
] as const;

export const MonetizationSection = ({ form }: MonetizationSectionProps) => {
  const showMonetizationOther = form.watch('monetization') === 'other';

  return (
    <>
      <FormField
        control={form.control}
        name="monetization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monetization Strategy</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select monetization strategy" />
                </SelectTrigger>
              </FormControl>
              <SelectContent position="item-aligned" className="bg-white">
                {MONETIZATION_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {showMonetizationOther && (
        <FormField
          control={form.control}
          name="monetizationOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Monetization Strategy</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe your monetization strategy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
