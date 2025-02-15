
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../list-product/types";

interface BasicInfoSectionProps {
  form: UseFormReturn<Partial<ListProductFormData>>;
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
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
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  };

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
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
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
