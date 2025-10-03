import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface ContactNumberFieldProps {
  form: UseFormReturn<ListProductFormData>;
}
export function ContactNumberField({
  form
}: ContactNumberFieldProps) {
  return <FormField control={form.control} name="contactNumber" render={({
    field
  }) => {}} />;
}