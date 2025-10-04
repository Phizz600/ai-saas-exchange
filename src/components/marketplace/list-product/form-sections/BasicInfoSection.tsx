
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
import { Card } from "@/components/ui/card";
import { BriefPitchField } from "./basic-info/BriefPitchField";
import { WebsiteLinkField } from "./basic-info/WebsiteLinkField";
import { ReasonForSellingField } from "./financial/ReasonForSellingField";
import { DemoLinkField } from "./basic-info/DemoLinkField";
import { YearFoundedField } from "./basic-info/YearFoundedField";
import { KeyFeaturesField } from "./basic-info/KeyFeaturesField";

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
        <ProductInfoFields form={form} />
        <BriefPitchField form={form} />
        <WebsiteLinkField form={form} />
        <ReasonForSellingField form={form} />
        <DemoLinkField form={form} />
        <YearFoundedField form={form} />
        <KeyFeaturesField form={form} />
        <ContactInfoFields form={form} />
        <ContactNumberField form={form} />
        <CompanyInfoFields form={form} />
        <LocationIndustryFields form={form} />
        <ImageSection form={form} />
        <NdaSection />
      </div>
    </Card>
  );
}
