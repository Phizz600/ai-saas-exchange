
import { useFormContext } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NdaSection() {
  const { watch, setValue, register } = useFormContext<ListProductFormData>();
  const formData = watch();

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
      
      {formData.requires_nda && (
        <div className="mt-4">
          <Label htmlFor="nda_content">Customize NDA Content (Optional)</Label>
          <Textarea
            id="nda_content"
            placeholder="Enter custom NDA text or leave empty to use the default template"
            className="h-32"
            {...register("nda_content")}
          />
          <p className="text-xs text-gray-500 mt-1">
            If left blank, a standard NDA template will be used
          </p>
        </div>
      )}
    </div>
  );
}
