
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SpecialNotesSection({ form }: SpecialNotesSectionProps) {
  const [newDeliverable, setNewDeliverable] = useState("");
  const deliverables = form.watch("deliverables") || [];

  const handleAddDeliverable = () => {
    if (!newDeliverable.trim()) return;
    if (deliverables.length >= 10) return;
    
    form.setValue("deliverables", [...deliverables, newDeliverable.trim()]);
    setNewDeliverable("");
  };

  const handleDeleteDeliverable = (index: number) => {
    const updatedDeliverables = deliverables.filter((_, i) => i !== index);
    form.setValue("deliverables", updatedDeliverables);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Deliverables & Special Notes</h2>
      
      <div className="space-y-4">
        <FormLabel className="flex items-center gap-2">
          Deliverables
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-white">
                <p>List what buyers will receive with your product (up to 10 items)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </FormLabel>

        <div className="space-y-3">
          {deliverables.map((deliverable, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 p-3 text-sm bg-gray-50 rounded-md">
                {deliverable}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteDeliverable(index)}
                className="h-9 w-9"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}

          {deliverables.length < 10 && (
            <div className="flex gap-2">
              <Input
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                placeholder="Enter a deliverable..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddDeliverable();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddDeliverable}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      <FormField
        control={form.control}
        name="specialNotes"
        render={({ field }) => (
          <FormItem>
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
              <Textarea
                placeholder="Share any additional information about your product that might be valuable for potential buyers..."
                className="min-h-[100px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
