
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const COMMON_DELIVERABLES = [
  { label: "Source Code", value: "source_code" },
  { label: "Documentation", value: "documentation" },
  { label: "API Keys", value: "api_keys" },
  { label: "Database Access", value: "database_access" },
  { label: "Domain Names", value: "domain_names" },
  { label: "Deployment Instructions", value: "deployment_instructions" },
  { label: "Training Materials", value: "training_materials" },
  { label: "Support Hours", value: "support_hours" },
  { label: "Design Assets", value: "design_assets" },
  { label: "User Data", value: "user_data" },
];

interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SpecialNotesSection({
  form
}: SpecialNotesSectionProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6 text-2xl font-semibold">Special Notes</h2>
      
      <div className="space-y-6">
        {/* Deliverables Section */}
        <FormField
          control={form.control}
          name="deliverables"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's included in the sale?</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {COMMON_DELIVERABLES.map((deliverable) => (
                  <FormField
                    key={deliverable.value}
                    control={form.control}
                    name="deliverables"
                    render={({ field }) => (
                      <FormItem
                        key={deliverable.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(deliverable.value)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              const updatedValues = checked
                                ? [...currentValues, deliverable.value]
                                : currentValues.filter((value) => value !== deliverable.value);
                              field.onChange(updatedValues);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {deliverable.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Special Notes Field */}
        <FormField
          control={form.control}
          name="specialNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special notes or additional information about your product that may be important for potential buyers..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
