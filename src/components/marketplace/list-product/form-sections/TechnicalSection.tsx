
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TechStackField } from "./technical/TechStackField";
import { StageField } from "./technical/StageField";
import { DemoUrlField } from "./technical/DemoUrlField";
import { IntegrationsField } from "./technical/IntegrationsField";

interface TechnicalSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TechnicalSection({ form }: TechnicalSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Technical Details</h2>
      
      <div className="space-y-4">
        <TechStackField form={form} />
        <StageField form={form} />
        <DemoUrlField form={form} />
        <IntegrationsField form={form} />
      </div>
    </div>
  );
}
