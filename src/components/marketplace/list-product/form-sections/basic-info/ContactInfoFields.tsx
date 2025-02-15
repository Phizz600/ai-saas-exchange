
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";

interface ContactInfoFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ContactInfoFields({ form }: ContactInfoFieldsProps) {
  // Empty return since we're removing all fields
  return <></>;
}
