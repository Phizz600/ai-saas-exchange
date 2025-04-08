
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  X, 
  FileCode, 
  Globe, 
  Users, 
  Mail, 
  MessageSquare, 
  BookOpen, 
  Database,
  Package
} from "lucide-react";
import { useState } from "react";

// Common deliverables that might be exchanged during a business exit
const commonDeliverables = [
  { id: 'source-code', label: 'Source Code', icon: FileCode },
  { id: 'domains', label: 'Domain Names', icon: Globe },
  { id: 'customer-list', label: 'Customer Lists', icon: Users },
  { id: 'email-list', label: 'Email Lists', icon: Mail },
  { id: 'social-media', label: 'Social Media Accounts', icon: MessageSquare },
  { id: 'documentation', label: 'Documentation', icon: BookOpen },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'assets', label: 'Digital Assets', icon: Package },
];

export function SpecialNotesSection() {
  const { register, watch, setValue, getValues } = useFormContext<ListProductFormData>();
  const formData = watch();
  const [newDeliverable, setNewDeliverable] = useState("");

  const addDeliverable = (text?: string) => {
    const deliverableToAdd = text || newDeliverable.trim();
    if (!deliverableToAdd) return;
    
    // Check if it's already in the list to avoid duplicates
    const currentDeliverables = getValues("deliverables") || [];
    if (currentDeliverables.includes(deliverableToAdd)) return;
    
    setValue("deliverables", [...currentDeliverables, deliverableToAdd]);
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
        
        {/* Quick Add Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {commonDeliverables.map((item) => (
            <Button
              key={item.id}
              type="button"
              onClick={() => addDeliverable(item.label)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              <PlusCircle className="h-3 w-3 ml-1 text-[#8B5CF6]" />
            </Button>
          ))}
        </div>
        
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
              onClick={() => addDeliverable()}
              className="flex-shrink-0"
              variant="secondary"
            >
              <PlusCircle className="h-5 w-5 mr-1 text-white" /> Add
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
