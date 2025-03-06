
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { useState } from "react";
import { GoogleAnalyticsDialog } from "./GoogleAnalyticsDialog";
import { BadgeCheck } from "lucide-react";

interface GoogleAnalyticsVerificationProps {
  form: UseFormReturn<ListProductFormData>;
}

export function GoogleAnalyticsVerification({ form }: GoogleAnalyticsVerificationProps) {
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const isVerified = form.watch("isGoogleAnalyticsVerified");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="isGoogleAnalyticsVerified"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isVerified}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center">
                Verify traffic with Google Analytics
                {isVerified && (
                  <BadgeCheck className="ml-2 h-5 w-5 text-green-500" />
                )}
              </FormLabel>
              <FormDescription>
                Optional but recommended for higher buyer trust and potentially higher valuations
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {!isVerified && (
        <Button
          type="button"
          variant={isVerified ? "outline" : "default"}
          onClick={() => setShowGoogleDialog(true)}
          className="w-full md:w-auto"
        >
          {isVerified ? "Verified ✓" : "Connect Google Analytics"}
        </Button>
      )}

      {isVerified && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <BadgeCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Traffic Verified</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your Google Analytics account has been successfully connected and your traffic data verified.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <GoogleAnalyticsDialog 
        open={showGoogleDialog}
        onOpenChange={setShowGoogleDialog}
        onConnect={(verified) => {
          form.setValue("isGoogleAnalyticsVerified", verified);
          form.setValue("isTrafficVerified", verified);
        }}
      />
    </div>
  );
}
