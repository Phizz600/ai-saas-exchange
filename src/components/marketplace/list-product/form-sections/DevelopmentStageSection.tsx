import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";

interface DevelopmentStageSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function DevelopmentStageSection({ form }: DevelopmentStageSectionProps) {
  const developmentStages = [
    "MVP",
    "Beta",
    "Production Ready",
    "Revenue Generating",
    "Scaling",
    "Other"
  ];

  return (
    <FormField
      control={form.control}
      name="stage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Development Stage</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select development stage" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {developmentStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}