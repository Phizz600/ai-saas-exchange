import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface LongDescriptionFieldProps {
  form: UseFormReturn<ListProductFormData>;
}
export function LongDescriptionField({
  form
}: LongDescriptionFieldProps) {
  return <FormField control={form.control} name="longDescription" render={({
    field
  }) => {}} />;
}