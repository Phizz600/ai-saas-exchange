
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubmissionAgreementsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SubmissionAgreements({ form }: SubmissionAgreementsProps) {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700">Submission Agreements</h3>
      
      <FormField
        control={form.control}
        name="accuracyAgreement"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormControl>
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="accuracyAgreement"
                  className="mt-1"
                />
                <FormLabel htmlFor="accuracyAgreement" className="text-sm leading-relaxed text-gray-600 text-left">
                  I confirm that I will complete this form thoroughly and accurately to the best of my ability. I understand that comprehensive and precise information significantly enhances my listing's credibility and increases the likelihood of attracting serious buyers and investors.
                </FormLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="termsAgreement"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormControl>
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="termsAgreement"
                  className="mt-1"
                />
                <FormLabel htmlFor="termsAgreement" className="text-sm leading-relaxed text-gray-600 text-left flex items-center space-x-1">
                  <span>I agree to the</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="h-auto p-0 text-[#8B5CF6]">
                        Terms and Conditions
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Terms and Conditions</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {/* Add your terms and conditions content here */}
                        <p className="text-sm text-gray-600">
                          Terms and conditions content goes here...
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </FormLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
