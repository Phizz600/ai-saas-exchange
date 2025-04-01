
import { useFormContext } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Switch } from "@/components/ui/switch";

export function NdaSection() {
  const { watch, setValue } = useFormContext<ListProductFormData>();
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
    </div>
  );
}
