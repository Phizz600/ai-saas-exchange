
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";

interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SpecialNotesSection({
  form
}: SpecialNotesSectionProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6">Special Notes</h2>
      
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
    </Card>
  );
}
