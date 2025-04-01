
import { useFormContext } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export function NdaSection() {
  const { watch, setValue, control } = useFormContext<ListProductFormData>();
  const formData = watch();
  const requiresNda = watch("requires_nda");

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
          }}
        />
      </div>

      {requiresNda && (
        <div className="mt-4">
          <FormField
            control={control}
            name="nda_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Custom NDA Text
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white w-80">
                        <p>Customize the NDA text that users will need to agree to before viewing your product details.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="By accessing the confidential information about this product, you agree to:
1. Keep all information confidential and not disclose it to any third party.
2. Use the information solely for the purpose of evaluating the product for potential purchase.
3. Not use the information to create a competing product.
4. Return or destroy all confidential information upon request."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
