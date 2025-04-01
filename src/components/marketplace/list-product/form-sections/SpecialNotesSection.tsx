
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

export function SpecialNotesSection() {
  const { register, watch, setValue, getValues } = useFormContext<ListProductFormData>();
  const formData = watch();
  const [newDeliverable, setNewDeliverable] = useState("");

  const addDeliverable = () => {
    if (!newDeliverable.trim()) return;
    
    const currentDeliverables = getValues("deliverables") || [];
    setValue("deliverables", [...currentDeliverables, newDeliverable]);
    setNewDeliverable("");
  };

  const removeDeliverable = (index: number) => {
    const currentDeliverables = [...(getValues("deliverables") || [])];
    currentDeliverables.splice(index, 1);
    setValue("deliverables", currentDeliverables);
  };

  return (
    <div className="space-y-6">
      {/* Deliverables Section - Moved before Special Notes */}
      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <h3 className="text-lg font-medium exo-2-heading mb-4">Deliverables</h3>
        <p className="text-sm text-gray-500 mb-4">
          List what buyers will receive with the purchase (source code, domains, customer lists, etc.)
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a deliverable..."
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDeliverable();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={addDeliverable}
              className="flex-shrink-0"
              variant="secondary"
            >
              <PlusCircle className="h-5 w-5 mr-1" /> Add
            </Button>
          </div>
          
          {/* Deliverable Items */}
          <div className="space-y-2">
            {(formData.deliverables || []).map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {(formData.deliverables || []).length === 0 && (
              <p className="text-sm text-gray-400 italic">No deliverables added yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Special Notes - Now after Deliverables */}
      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <Label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700">
          Special Notes or Instructions
        </Label>
        <Textarea
          id="specialNotes"
          placeholder="Include any specific details or instructions for potential buyers"
          className="mt-1 h-32"
          {...register("specialNotes")}
        />
      </div>
    </div>
  );
}
