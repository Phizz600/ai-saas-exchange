import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
const COMMON_DELIVERABLES = [{
  label: "Source Code",
  value: "source_code"
}, {
  label: "Documentation",
  value: "documentation"
}, {
  label: "API Keys",
  value: "api_keys"
}, {
  label: "Database Access",
  value: "database_access"
}, {
  label: "Domain Names",
  value: "domain_names"
}, {
  label: "Deployment Instructions",
  value: "deployment_instructions"
}, {
  label: "Training Materials",
  value: "training_materials"
}, {
  label: "Support Hours",
  value: "support_hours"
}, {
  label: "Design Assets",
  value: "design_assets"
}, {
  label: "User Data",
  value: "user_data"
}];
interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}
export function SpecialNotesSection({
  form
}: SpecialNotesSectionProps) {
  return <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Deliverables</h2>
      
      <div className="space-y-8">
        {/* Deliverables Section */}
        <FormField control={form.control} name="deliverables" render={({
        field
      }) => <FormItem>
              <div className="flex justify-between items-center mb-4">
                
              </div>
              
              {/* Quick Add Buttons */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {COMMON_DELIVERABLES.map(deliverable => <FormField key={deliverable.value} control={form.control} name="deliverables" render={({
              field
            }) => <FormItem key={deliverable.value}>
                          <FormControl>
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                  const currentValues = field.value || [];
                  const isSelected = currentValues.includes(deliverable.value);
                  const updatedValues = isSelected ? currentValues.filter(value => value !== deliverable.value) : [...currentValues, deliverable.value];
                  field.onChange(updatedValues);
                }} className={field.value?.includes(deliverable.value) ? "bg-primary text-white" : "text-xs"}>
                              <Plus className="h-4 w-4" />
                              {deliverable.label}
                            </Button>
                          </FormControl>
                        </FormItem>} />)}
                </div>
              </div>
              <FormMessage />
            </FormItem>} />

        {/* Special Notes Field */}
        <FormField control={form.control} name="specialNotes" render={({
        field
      }) => <FormItem>
              <FormLabel>Special Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any special notes or additional information about your product that may be important for potential buyers..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>
    </Card>;
}