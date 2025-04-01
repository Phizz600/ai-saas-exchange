
import { useFormContext } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";

export function NdaSection() {
  const { watch, setValue, control } = useFormContext<ListProductFormData>();
  const formData = watch();
  const [showNdaContent, setShowNdaContent] = useState(!!formData.requires_nda);
  
  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium exo-2-heading">Confidentiality Requirements</h3>
          <p className="text-sm text-gray-500">
            Protect sensitive details by requiring buyers to sign an NDA
          </p>
        </div>
        <Switch 
          id="requires-nda"
          checked={formData.requires_nda || false}
          onCheckedChange={(checked) => {
            setValue("requires_nda", checked);
            setShowNdaContent(checked);
          }}
        />
      </div>
      
      {showNdaContent && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <FormField
            control={control}
            name="nda_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom NDA Text (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add your custom NDA text here. Leave blank to use our standard NDA text."
                    className="min-h-[120px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  This text will be shown to potential buyers when they need to sign an NDA to view your product details.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
