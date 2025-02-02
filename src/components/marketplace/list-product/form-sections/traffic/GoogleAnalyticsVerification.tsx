import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { useState } from "react";
import { GoogleAnalyticsDialog } from "./GoogleAnalyticsDialog";

interface GoogleAnalyticsVerificationProps {
  form: UseFormReturn<ListProductFormData>;
}

export function GoogleAnalyticsVerification({ form }: GoogleAnalyticsVerificationProps) {
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isGoogleAnalyticsVerified"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Verify traffic with Google Analytics (optional but recommended for higher buyer trust)
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      {form.watch("isGoogleAnalyticsVerified") && (
        <Button
          type="button"
          onClick={() => setShowGoogleDialog(true)}
          className="w-full md:w-auto"
        >
          Connect Google Analytics
        </Button>
      )}

      <GoogleAnalyticsDialog 
        open={showGoogleDialog}
        onOpenChange={setShowGoogleDialog}
        onConnect={(verified) => form.setValue("isGoogleAnalyticsVerified", verified)}
      />
    </div>
  );
}