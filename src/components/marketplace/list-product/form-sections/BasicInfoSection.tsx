
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { ContactInfoFields } from "./basic-info/ContactInfoFields";
import { CompanyInfoFields } from "./basic-info/CompanyInfoFields";
import { ProductInfoFields } from "./basic-info/ProductInfoFields";
import { LocationIndustryFields } from "./basic-info/LocationIndustryFields";
import { ImageSection } from "./ImageSection";
import { NdaSection } from "./basic-info/NdaSection";
import { Card } from "@/components/ui/card";

interface BasicInfoSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function BasicInfoSection({
  form
}: BasicInfoSectionProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-50 mb-6">Basics</h2>
      <div className="space-y-4">
        <ContactInfoFields form={form} />
        <ProductInfoFields form={form} />
        <CompanyInfoFields form={form} />
        <LocationIndustryFields form={form} />
        <ImageSection form={form} />
        <NdaSection />
      </div>
    </Card>
  );
}
