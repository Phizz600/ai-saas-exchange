
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { ContactInfoFields } from "./basic-info/ContactInfoFields";
import { CompanyInfoFields } from "./basic-info/CompanyInfoFields";
import { ProductInfoFields } from "./basic-info/ProductInfoFields";
import { LocationIndustryFields } from "./basic-info/LocationIndustryFields";

interface BasicInfoSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basics</h2>
      <div className="space-y-4">
        <ContactInfoFields form={form} />
        <ProductInfoFields form={form} />
        <CompanyInfoFields form={form} />
        <LocationIndustryFields form={form} />
      </div>
    </div>
  );
}
