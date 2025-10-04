
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TechStackField } from "./technical/TechStackField";
import { StageField } from "./technical/StageField";
import { DemoUrlField } from "./technical/DemoUrlField";
import { IntegrationsField } from "./technical/IntegrationsField";
import { LLMField } from "./technical/LLMField";
import { BuiltByField } from "./basic-info/BuiltByField";
import { Card } from "@/components/ui/card";

interface TechnicalSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TechnicalSection({
  form
}: TechnicalSectionProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6">Technical Details</h2>
      
      <div className="space-y-4">
        <BuiltByField form={form} />
        <TechStackField form={form} />
        <LLMField form={form} />
        <StageField form={form} />
        <DemoUrlField form={form} />
        <IntegrationsField form={form} />
      </div>
    </Card>
  );
}
