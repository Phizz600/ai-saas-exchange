import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";
import { Plus, Code, Link, Mail, Image, Database, FileLock, FileText, Briefcase, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const COMMON_DELIVERABLES = [
  { label: "Source Code & Repository", value: "source_code", icon: Code },
  { label: "Intellectual Property Rights", value: "ip_rights", icon: FileLock },
  { label: "Social Media Accounts", value: "social_media", icon: Link },
  { label: "Email Lists & Subscribers", value: "email_lists", icon: Mail },
  { label: "Brand Assets & Marketing", value: "brand_assets", icon: Image },
  { label: "Customer Database", value: "customer_data", icon: Database },
  { label: "Technical Documentation", value: "tech_docs", icon: FileText },
  { label: "Business Operations & SOPs", value: "business_ops", icon: Briefcase },
  { label: "API Keys & Integrations", value: "api_keys", icon: Wrench },
  { label: "Domain Names & Hosting", value: "hosting", icon: Link }
];

interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SpecialNotesSection({
  form
}: SpecialNotesSectionProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDeliverable, setCustomDeliverable] = useState("");

  const handleAddCustomDeliverable = () => {
    if (customDeliverable.trim()) {
      const currentValues = form.getValues("deliverables") || [];
      form.setValue("deliverables", [...currentValues, `custom_${customDeliverable.trim()}`]);
      setCustomDeliverable("");
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-violet-500">Assets & Deliverables</h2>
      
      <div className="space-y-8">
        <FormField 
          control={form.control} 
          name="deliverables" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold mb-2">
                Select all assets and deliverables included in the sale
              </FormLabel>
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_DELIVERABLES.map(deliverable => (
                    <Button 
                      key={deliverable.value}
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const currentValues = field.value || [];
                        const isSelected = currentValues.includes(deliverable.value);
                        const updatedValues = isSelected 
                          ? currentValues.filter(value => value !== deliverable.value)
                          : [...currentValues, deliverable.value];
                        field.onChange(updatedValues);
                      }} 
                      className={`
                        w-full justify-start
                        ${field.value?.includes(deliverable.value) 
                          ? "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90" 
                          : "text-sm hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] transition-colors"}
                      `}
                    >
                      <deliverable.icon className={`h-4 w-4 mr-2 ${
                        field.value?.includes(deliverable.value) 
                          ? "text-white" 
                          : "text-[#8B5CF6]"
                      }`} />
                      {deliverable.label}
                    </Button>
                  ))}
                  
                  {/* Add Custom Deliverable Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="w-full justify-start text-sm hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2 text-[#8B5CF6]" />
                    Add Other Deliverable
                  </Button>
                </div>

                {/* Custom Deliverable Input */}
                {showCustomInput && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={customDeliverable}
                      onChange={(e) => setCustomDeliverable(e.target.value)}
                      placeholder="Enter custom deliverable..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomDeliverable}
                      disabled={!customDeliverable.trim()}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                )}
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
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special notes about included assets, transfer process, or additional information that may be important for potential buyers..." 
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
