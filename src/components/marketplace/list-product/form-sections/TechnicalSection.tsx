
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TechStackField } from "./technical/TechStackField";
import { StageField } from "./technical/StageField";
import { DemoUrlField } from "./technical/DemoUrlField";
import { IntegrationsField } from "./technical/IntegrationsField";
import { LLMField } from "./technical/LLMField";
import { Card } from "@/components/ui/card";

interface TechnicalSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TechnicalSection({
  form
}: TechnicalSectionProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6">Technical Details</h2>
      
      <div className="space-y-4">
        <TechStackField form={form} />
        <LLMField form={form} />
        <StageField form={form} />
        <DemoUrlField form={form} />
        <IntegrationsField form={form} />
      </div>
    </Card>
  );
}
