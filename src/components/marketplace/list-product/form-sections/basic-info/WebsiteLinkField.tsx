import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface WebsiteLinkFieldProps {
  form: UseFormReturn<ListProductFormData>;
}
export function WebsiteLinkField({
  form
}: WebsiteLinkFieldProps) {
  return <FormField control={form.control} name="productLink" render={({
    field
  }) => {}} />;
}