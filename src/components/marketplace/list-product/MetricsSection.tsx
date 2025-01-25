import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";

interface MetricsSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function MetricsSection({ form }: MetricsSectionProps) {
  const categories = [
    "Content Generation",
    "Image Generation",
    "Data Analysis",
    "Chatbots",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Other"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="monthlyTraffic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Traffic</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Enter monthly visitors"
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
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}