
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMMON_DELIVERABLES = [
  // Business Assets & IP
  { label: "Source Code & Repository Access", value: "source_code" },
  { label: "Domain Names & DNS Settings", value: "domain_names" },
  { label: "Intellectual Property Rights", value: "ip_rights" },
  { label: "Patents & Trademarks", value: "patents" },
  { label: "Brand Assets & Style Guides", value: "brand_assets" },
  
  // Digital & Social Assets
  { label: "Social Media Accounts", value: "social_media" },
  { label: "Email Lists & Subscribers", value: "email_lists" },
  { label: "Content & Marketing Materials", value: "marketing_materials" },
  { label: "Ad Accounts & Analytics", value: "ad_accounts" },
  
  // Technical Infrastructure
  { label: "Hosting & Server Access", value: "hosting_access" },
  { label: "Development Environment", value: "dev_environment" },
  { label: "API Keys & Integrations", value: "api_keys" },
  { label: "Database & Backups", value: "database_access" },
  { label: "SSL Certificates", value: "ssl_certs" },
  
  // Documentation & Operations
  { label: "Technical Documentation", value: "tech_docs" },
  { label: "User Guides & Tutorials", value: "user_guides" },
  { label: "Standard Operating Procedures", value: "sop_docs" },
  { label: "Customer Service Scripts", value: "cs_scripts" },
  { label: "Training Materials", value: "training_materials" },
  
  // Business Data
  { label: "Customer Database", value: "customer_data" },
  { label: "Revenue & Financial Records", value: "financial_records" },
  { label: "Vendor Contracts & Relationships", value: "vendor_contracts" },
  { label: "Analytics & Metrics Data", value: "analytics_data" },
  { label: "Compliance Documents", value: "compliance_docs" }
];

interface SpecialNotesSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SpecialNotesSection({
  form
}: SpecialNotesSectionProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-violet-500">Assets & Deliverables</h2>
      
      <div className="space-y-8">
        <FormField control={form.control} name="deliverables" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-base font-semibold mb-2">
                Select all assets and deliverables included in the sale
              </FormLabel>
              {/* Quick Add Buttons */}
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {COMMON_DELIVERABLES.map(deliverable => <FormField key={deliverable.value} control={form.control} name="deliverables" render={({
              field
            }) => <FormItem key={deliverable.value}>
                          <FormControl>
                            <Button 
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
                                  : "text-sm hover:bg-[#8B5CF6]/10"}
                                transition-colors duration-200
                              `}
                            >
                              <Plus className={`h-4 w-4 mr-2 ${
                                field.value?.includes(deliverable.value) 
                                  ? "text-white" 
                                  : "text-[#8B5CF6]"
                              }`} />
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
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special notes about included assets, transfer process, or additional information that may be important for potential buyers..." 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>
    </Card>
  );
}
