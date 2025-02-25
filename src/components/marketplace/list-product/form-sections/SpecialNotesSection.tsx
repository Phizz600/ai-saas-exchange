import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}
export function SpecialNotesSection({
  form
}: SpecialNotesSectionProps) {
  return <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Deliverables &amp; Special Notes</h2>
      
      <FormField control={form.control} name="specialNotes" render={({
      field
    }) => <FormItem>
            <FormLabel className="flex items-center gap-2">
              Additional Information
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Add any special details about your product that potential buyers should know</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Share any additional information about your product that might be valuable for potential buyers..." className="min-h-[100px] resize-y" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />
    </div>;
}