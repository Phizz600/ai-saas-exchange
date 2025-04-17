
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

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
      <h2 className="text-2xl font-semibold mb-6">Deliverables</h2>
      
      <div className="space-y-8">
        {/* Deliverables Section */}
        <FormField
          control={form.control}
          name="deliverables"
          render={({ field }) => (
            <FormItem>
              <p className="text-lg mb-4">Common deliverables:</p>
              <div className="flex flex-wrap gap-3">
                {COMMON_DELIVERABLES.map((deliverable) => (
                  <FormField
                    key={deliverable.value}
                    control={form.control}
                    name="deliverables"
                    render={({ field }) => (
                      <FormItem
                        key={deliverable.value}
                        className="flex items-center"
                      >
                        <FormControl>
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = field.value || [];
                              const isSelected = currentValues.includes(deliverable.value);
                              const updatedValues = isSelected
                                ? currentValues.filter((value) => value !== deliverable.value)
                                : [...currentValues, deliverable.value];
                              field.onChange(updatedValues);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                              field.value?.includes(deliverable.value)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                            {deliverable.label}
                          </button>
                        </FormControl>
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
