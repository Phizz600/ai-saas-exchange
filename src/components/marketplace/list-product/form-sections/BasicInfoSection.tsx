
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
    <Card className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6">Basics</h2>
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
