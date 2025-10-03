
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { ContactInfoFields } from "./basic-info/ContactInfoFields";
import { CompanyInfoFields } from "./basic-info/CompanyInfoFields";
import { ProductInfoFields } from "./basic-info/ProductInfoFields";
import { LocationIndustryFields } from "./basic-info/LocationIndustryFields";
import { ImageSection } from "./ImageSection";
import { NdaSection } from "./basic-info/NdaSection";
import { LongDescriptionField } from "./basic-info/LongDescriptionField";
import { ContactNumberField } from "./basic-info/ContactNumberField";
import { BuiltByField } from "./basic-info/BuiltByField";
import { Card } from "@/components/ui/card";

interface BasicInfoSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function BasicInfoSection({
  form
}: BasicInfoSectionProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6">Basics</h2>
      <div className="space-y-4">
        <ContactInfoFields form={form} />
        <ContactNumberField form={form} />
        <ProductInfoFields form={form} />
        <LongDescriptionField form={form} />
        <CompanyInfoFields form={form} />
        <BuiltByField form={form} />
        <LocationIndustryFields form={form} />
        <ImageSection form={form} />
        <NdaSection />
      </div>
    </Card>
  );
}
